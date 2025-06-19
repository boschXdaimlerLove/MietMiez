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

func UserCreate(c *fiber.Ctx) error {
	user := new(models.User)

	if err := util.GetJsonFromRequest(c, user); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	salt, hash, err := util.HashPassword(user.Hash) // password sent by post request will be mapped to hash field
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{})
	}

	user.Hash = hash
	user.Salt = salt

	dbInstance := database.GetDB()
	result := dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(&user)
	if result.RowsAffected == 0 {
		Logger.Debug().Str("email", user.Email).Msg("user creation: duplicate user error")
		return c.SendStatus(fiber.StatusConflict)
	} else if result.Error != nil {
		Logger.Err(err).Msg("User Creation Failed")
	}

	// TODO eventually add email confirmations for accounts (or manual confirmation)
	return c.SendStatus(fiber.StatusCreated)
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
	passwordCorrect, err := util.CheckPasswordHash(request.Password, user.Hash, user.Salt)
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

	cookie := &fiber.Cookie{
		Name:    "session",
		Value:   session.ID,
		Expires: time.Now().Add(config.Cfg.Server.SessionDuration),
		Secure:  config.Cfg.Server.Production,
	}

	c.Cookie(cookie)
	return c.SendStatus(fiber.StatusOK)
}

func UserDelete(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	Logger.Debug().Any("user", user.ToPublic()).Msg("user deletion")

	dbInstance := database.GetDB()
	dbInstance.Delete(&user)

	return c.SendStatus(fiber.StatusOK)
}

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

func UserLogout(c *fiber.Ctx) error {
	err := util.InvalidateSession(c)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	c.ClearCookie("session")
	return c.SendStatus(fiber.StatusOK)
}

func UserResetPassword(c *fiber.Ctx) error {
	var pwResetRequest models.PasswordResetRequest
	var user models.User

	err := c.BodyParser(&pwResetRequest)
	if err != nil {
		Logger.Err(err).Msg("Fiber Body Parser failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// get user from email
	dbInstance := database.GetDB()
	result := dbInstance.First(&user, "email = ?", c.Params("email"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
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
	err = util.SendResetMail(resetToken.ID, user.Email)
	if err != nil {
		Logger.Err(err).Msg("Sending reset mail failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.SendStatus(fiber.StatusOK)
}

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

func UserChangePassword(c *fiber.Ctx) error {
	request := new(models.ChangePasswordRequest)

	if err := c.BodyParser(request); err != nil {
		Logger.Err(err).Msg("Fiber Body Parser failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	var user models.User

	dbInstance := database.GetDB()
	result := dbInstance.Where("email = ?", request.Email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	passwordCorrect, err := util.CheckPasswordHash(request.OldPassword, user.Hash, user.Salt)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	if !passwordCorrect {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	user.Salt, user.Hash, err = util.HashPassword(request.NewPassword)
	if err != nil {
		return err
	}

	result = dbInstance.Save(&user)
	if result.Error != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

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

func UserAddFavourite(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNotImplemented)
}

func GetUser(c *fiber.Ctx) error {
	if isAuthenticated, _ := util.GetRequestUser(c); isAuthenticated {
		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusUnauthorized)
}
