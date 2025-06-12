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
		Logger.Debug().Str("email", user.Email).Str("username", user.Username).Msg("user creation: duplicate user error")
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
	result := dbInstance.First(&user, "username = ?", request.Username)
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
	result = dbInstance.Create(session)
	if result.Error != nil {
		Logger.Err(err).Msg("Creating session failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// TODO hand back LoginResponse OR set cookie! (depends on https://github.com/boschXdaimlerLove/MietMiez/pull/10)
	// all checks passed, cookie will be handed out
	c.Cookie(&fiber.Cookie{
		Name:  "session",
		Value: session.ID,
	})

	return c.Status(fiber.StatusOK).JSON(models.LoginResponse{
		Token:     session.ID,
		ExpiresIn: 7 * 24 * 60 * 60, // 7 days
	})
}

func UserDelete(c *fiber.Ctx) error {
	var user models.User
	var isAuthenticated bool

	isAuthenticated, user = util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

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
	result := dbInstance.First(&user, "email = ?", c.Params("id"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusOK)
	} else if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	Logger.Debug().Any("user", user).Msg("Resetting password for user")

	// create resetToken
	var resetToken models.PasswordResetToken
	resetToken.User = user
	resetToken.ID = util.GetRandomText(config.Cfg.Server.TokenLength)

	Logger.Debug().Any("resetToken", resetToken).Any("user", user).Msg("Reset token created")

	// write resetToken to db
	result = dbInstance.Create(&resetToken)
	if result.Error != nil {
		Logger.Err(result.Error).Msg("Creating reset token failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// sendEmail
	// TODO
	err = util.SendResetMail(resetToken.ID, user.Email)
	if err != nil {
		Logger.Err(err).Msg("Sending reset mail failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.SendStatus(fiber.StatusNotImplemented)
}

func UserInfo(c *fiber.Ctx) error {
	var user models.User
	dbInstance := database.GetDB()
	result := dbInstance.First(&user, "username = ?", c.Params("user"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("UserInfo failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(user.ToPublic())
}

func UserGetFavorites(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNotImplemented)
}

func UserAddFavorite(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNotImplemented)
}
