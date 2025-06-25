package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func AdvertisementInformation(c *fiber.Ctx) error {
	var advertisement models.Advertisement
	dbInstance := database.GetDB()
	result := dbInstance.
		Preload("User").
		First(&advertisement, "id = ?", c.Params("id"))

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("Failed to get advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(advertisement.ToPublic())
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
		Logger.Warn().Interface("advertisement", advertisement).Msg("cannot create new advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusCreated).JSON(advertisement.ToPublic())
}

func UpdateAdvertisement(c *fiber.Ctx) error {
	var advertisementFromDB, advertisementFromUser models.Advertisement
	dbInstance := database.GetDB()

	isLoggedIn, user := util.GetRequestUser(c)
	if !isLoggedIn {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	result := dbInstance.
		Preload("User").
		Where("id = ?", c.Params("id")).
		First(&advertisementFromDB)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("Failed to update advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if advertisementFromDB.UserID != user.ID {
		return c.SendStatus(fiber.StatusForbidden)
	}

	err := util.GetJsonFromRequest(c, &advertisementFromUser)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if advertisementFromUser.Title != "" {
		advertisementFromDB.Title = advertisementFromUser.Title
	}

	if advertisementFromUser.Description != "" {
		advertisementFromDB.Description = advertisementFromUser.Description
	}

	if advertisementFromUser.Animal != "" {
		advertisementFromDB.Animal = advertisementFromUser.Animal
	}

	if len(advertisementFromUser.Images) > 0 {
		advertisementFromDB.Images = advertisementFromUser.Images
	}

	dbInstance.Save(&advertisementFromDB)

	return c.SendStatus(fiber.StatusOK)
}
