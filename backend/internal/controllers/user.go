package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// UserCreate creates a new user
// this functionality relies on email activation; if activated, create activation token
func UserCreate(c *fiber.Ctx) error {
	user := &models.User{}

	if err := util.GetJsonFromRequest(c, user); err != nil {
		Logger.Trace().Err(err).Any("c.Body()", c.Body()).Msg("registration failed to parse json")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if len(user.Hash) < 10 {
		Logger.Trace().Str("email", user.Email).Msg("password for registration is too short!")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	hash, err := util.HashPassword(user.Hash) // password sent by post request will be mapped to hash field
	if err != nil {
		Logger.Err(err).Msg("registration failed to hash password")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	user.Hash = hash
	user.IsActivated = !config.Cfg.Server.EnforceEmailActivation

	dbInstance := database.GetDB()
	result := dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(user)
	if result.RowsAffected == 0 {
		Logger.Debug().Str("email", user.Email).Msg("user creation: duplicate user error")
		return c.SendStatus(fiber.StatusConflict)
	} else if result.Error != nil {
		Logger.Err(err).Msg("User Creation Failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if !user.IsActivated {
		Logger.Debug().Str("email", user.Email).Msg("generating activation token")
		activationToken := models.UserActivationToken{}
		activationToken.UserID = user.ID
		activationToken.ID = util.GetRandomText(config.Cfg.Server.TokenLength)
		if err := dbInstance.Create(&activationToken).Error; err != nil {
			Logger.Err(err).Msg("User Activation Token Create Failed")
			return c.SendStatus(fiber.StatusInternalServerError)
		}
		go util.SendUserActivationMail(activationToken.ID, user.Email)
	}
	return c.SendStatus(fiber.StatusCreated)
}

// UserActivate lets users activate/verify their mail address
// token is sent via mail; has to be configured in config
func UserActivate(c *fiber.Ctx) error {
	activationToken := models.UserActivationToken{
		ID: c.Params("token"),
	}

	dbInstance := database.GetDB()
	result := dbInstance.
		Preload("User").
		First(&activationToken)
	if result.RowsAffected == 0 {
		return c.SendStatus(fiber.StatusBadRequest)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("UserActivation getting token from db failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	user := activationToken.User
	user.IsActivated = true

	result = dbInstance.Save(&user)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("UserActivation save user failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	result = dbInstance.Delete(&activationToken)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("UserActivation delete token failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.SendStatus(fiber.StatusOK)
}

func UserLogin(c *fiber.Ctx) error {
	request := new(models.LoginRequest)

	if err := c.BodyParser(request); err != nil {
		Logger.Err(err).Msg("Fiber Body Parser failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	var user models.User

	dbInstance := database.GetDB()
	result := dbInstance.First(&user, "email = ?", request.Email)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	if !user.IsActivated && config.Cfg.Server.EnforceEmailActivation {
		return c.SendStatus(fiber.StatusLocked)
	}

	passwordCorrect, err := util.CheckPasswordHash(request.Password, user.Hash)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	if !passwordCorrect {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// setup user session
	var session models.Session
	session.User = user
	session.ID = util.GetRandomText(config.Cfg.Server.TokenLength)
	session.ValidUntil = time.Now().Add(config.Cfg.Server.SessionDuration)

	// write session to db
	result = dbInstance.Create(&session)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("Creating session failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token":      session.ID,
		"expires_at": time.Now().Add(config.Cfg.Server.SessionDuration),
	})
}

// UserDelete deletes logged in user
func UserDelete(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	Logger.Trace().Any("user", user.ToPublic()).Msg("user deletion")

	dbInstance := database.GetDB()

	var advertisements []models.Advertisement
	result := dbInstance.Find(&advertisements, "user_id = ?", user.ID)
	if result.RowsAffected == 0 {
		Logger.Trace().Msg("no ads to delete for user deletion")
		dbInstance.Select(clause.Associations).Delete(&user)
		return c.SendStatus(fiber.StatusOK)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("fetching advertisements for user deletion failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	go dbInstance.Delete(&advertisements)

	// use unscoped to not use gorms soft delete feature
	// https://gorm.io/docs/delete.html#Delete-permanently
	dbInstance.Unscoped().Select(clause.Associations).Delete(&user)

	return c.SendStatus(fiber.StatusOK)
}

// UserUpdate allows users to update their profile
// user can edit: city, first name, last name, zip code and mail
// password can be changed via UserChangePassword
func UserUpdate(c *fiber.Ctx) error {
	var userFromDB, userFromRequest models.User
	var isAuthenticated bool

	isAuthenticated, userFromDB = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// parse request body
	if err := util.GetJsonFromRequest(c, &userFromRequest); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// Only update fields that are non-empty
	if userFromRequest.City != "" {
		userFromDB.City = userFromRequest.City
	}
	if userFromRequest.FirstName != "" {
		userFromDB.FirstName = userFromRequest.FirstName
	}
	if userFromRequest.LastName != "" {
		userFromDB.LastName = userFromRequest.LastName
	}
	if userFromRequest.ZipCode != "" {
		userFromDB.ZipCode = userFromRequest.ZipCode
	}
	if userFromRequest.Email != "" {
		userFromDB.Email = userFromRequest.Email
	}

	dbInstance := database.GetDB()
	result := dbInstance.Save(&userFromDB)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("Updating user failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// UserLogout invalidates session
func UserLogout(c *fiber.Ctx) error {
	err := util.InvalidateSession(c)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.SendStatus(fiber.StatusOK)
}

func UserResetPasswordRequest(c *fiber.Ctx) error {
	var pwResetRequest models.PasswordResetEmailRequest
	var user models.User

	err := c.BodyParser(&pwResetRequest)
	if err != nil {
		Logger.Trace().Err(err).Msg("Fiber Body Parser failed")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	// get user from email
	dbInstance := database.GetDB()
	result := dbInstance.First(&user, "email = ?", pwResetRequest.Email)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		Logger.Debug().Any("user", user.ToPublic()).Msg("user for reset password not found")
		return c.SendStatus(fiber.StatusOK)
	} else if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	Logger.Debug().Any("user", user.ToPublic()).Msg("Resetting password for user")

	// create resetToken
	var resetToken models.PasswordResetToken
	resetToken.User = user
	resetToken.ID = util.GetRandomText(config.Cfg.Server.TokenLength)

	Logger.Debug().Any("resetToken", resetToken).Any("user", user.ToPublic()).Msg("Reset token created")

	// write resetToken to db
	result = dbInstance.Create(&resetToken)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("Creating reset token failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// sendEmail
	go util.SendResetMail(resetToken.ID, user.Email)
	return c.SendStatus(fiber.StatusOK)
}

func UserResetPassword(c *fiber.Ctx) error {
	resetToken := models.PasswordResetToken{
		ID: c.Params("token"),
	}
	var request models.PasswordResetRequest
	err := util.GetJsonFromRequest(c, &request)
	if err != nil {
		Logger.Trace().Err(err).Msg("bad request: resetting password failed")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if len(request.Password) < 10 {
		Logger.Trace().Str("token", resetToken.ID).Msg("password for registration is too short!")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	dbInstance := database.GetDB()
	result := dbInstance.Preload("User").First(&resetToken)
	if result.RowsAffected == 0 {
		return c.SendStatus(fiber.StatusBadRequest)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("loading reset token from db failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	Logger.Trace().Interface("resetToken", resetToken).Interface("user", resetToken.User).Msg("Resetting password")
	user := resetToken.User
	user.Hash, err = util.HashPassword(request.Password)
	if err != nil {
		return err
	}

	result = dbInstance.Save(&user)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("resetting user pw failed to save to db")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// UserInfo returns a public user profile
// there's a difference between public and internal user profile!
// see [models.User] for mor information
func UserInfo(c *fiber.Ctx) error {
	var user models.User
	dbInstance := database.GetDB()
	result := dbInstance.First(&user, "email = ?", c.Params("email"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("UserInfo failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(user.ToPublic())
}

// UserChangePassword changes password of user
// notice check of old password
// TODO use cookie for authentication, not email
func UserChangePassword(c *fiber.Ctx) error {
	request := new(models.ChangePasswordRequest)

	if err := c.BodyParser(request); err != nil {
		Logger.Trace().Err(err).Any("c.Body", c.Body()).Msg("parsing change password request failed")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if len(request.NewPassword) < 10 {
		Logger.Trace().Str("email", request.Email).Msg("password for registration is too short!")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	var user models.User

	dbInstance := database.GetDB()
	result := dbInstance.Where("email = ?", request.Email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	passwordCorrect, err := util.CheckPasswordHash(request.OldPassword, user.Hash)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	if !passwordCorrect {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	user.Hash, err = util.HashPassword(request.NewPassword)
	if err != nil {
		return err
	}

	result = dbInstance.Save(&user)
	if result.Error != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

// UserGetFavourites returns an JSON array with all user's favourites
func UserGetFavourites(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	var favourites []models.Favourite

	dbInstance := database.GetDB()
	result := dbInstance.
		Preload("User").
		Where("user_id = ?", user.ID).Find(&favourites)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		Logger.Err(result.Error).Msg("Getting user favourites failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(favourites)
}

// UserAddFavourite adds a new favourite to user favourites
func UserAddFavourite(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	id := c.QueryInt("advertisement")

	var favourite = models.Favourite{
		UserID:          user.ID,
		AdvertisementID: uint(id),
	}

	dbInstance := database.GetDB()
	result := dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(&favourite)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// DeleteFavourite deletes specified advertisement from user's favourites list
func DeleteFavourite(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("id must be an integer")
	}

	dbInstance := database.GetDB()
	result := dbInstance.Delete(&models.Favourite{}, "user_id = ? AND advertisement_id = ?", user.ID, id)

	if result.Error != nil {
		Logger.Err(result.Error).Msg("error deleting user fav")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetUser returns currently logged-in user who made request
func GetUser(c *fiber.Ctx) error {
	if isAuthenticated, user := util.GetRequestUser(c); isAuthenticated {
		// only public data -> hash and salt is not needed by frontend to do basic operations and check data
		return c.Status(fiber.StatusOK).JSON(user.ToPublic())
	}

	return c.SendStatus(fiber.StatusUnauthorized)
}
