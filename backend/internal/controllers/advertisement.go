package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm/clause"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func AdvertisementInformation(c *fiber.Ctx) error {
	var advertisement models.Advertisement
	dbInstance := database.GetDB()
	result := dbInstance.
		Preload("User").
		First(&advertisement, "id = ?", c.Params("id"))

	if result.Error != nil {
		Logger.Debug().Interface("advertisement", advertisement).Msg("error obtain advertisement information")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(advertisement)
}

func CreateAdvertisement(c *fiber.Ctx) error {
	var userFromDB models.User
	var isAuthenticated bool

	if isAuthenticated, userFromDB = util.GetRequestUser(c); !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	advertisement := new(models.Advertisement)
	advertisement.User = userFromDB

	if err := util.GetJsonFromRequest(c, advertisement); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	dbInstance := database.GetDB()
	result := dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(&advertisement)
	if result.RowsAffected == 0 {
		// abracadabra here's an error with bad logging
		Logger.Debug().Interface("advertisement", advertisement).Msg("cannot create new advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusCreated).JSON(advertisement)
}
