package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"github.com/gofiber/fiber/v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func CategoryList(c *fiber.Ctx) error {
	dbInstance := database.GetDB()
	Logger.Debug().Msg("Getting category list")
	var categoryList []models.Category
	if err := dbInstance.Order("title").Find(&categoryList).Error; err != nil {
		Logger.Error().Err(err).Msg("Getting category list")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	var publicCategoryList []models.PublicCategory
	for _, category := range categoryList {
		publicCategoryList = append(publicCategoryList, category.ToPublic())
	}

	return c.Status(fiber.StatusOK).JSON(publicCategoryList)
}
