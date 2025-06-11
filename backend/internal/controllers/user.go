package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"github.com/gofiber/fiber/v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)

	if err := c.BodyParser(user); err != nil {
		Logger.Err(err).Msg("Fiber Body Parser failed")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	hash, salt, err := util.HashPassword(user.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{})
	}

	user.Password = hash
	user.Salt = salt

	dbInstance := database.GetDB()
	dbInstance.Create(&user)

	// TODO eventually add email confirmations for accounts (or manual confirmation)
	return c.SendStatus(200)
}
