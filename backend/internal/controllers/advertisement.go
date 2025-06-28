package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"strconv"
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

func GetRecentAdvertisements(c *fiber.Ctx) error {
	var advertisements models.AdvertisementList
	dbInstance := database.GetDB()

	page, _ := strconv.Atoi(c.Query("page"))
	result := dbInstance.Scopes(util.Paginate(page)).Order("created_at desc").Preload("User").Find(&advertisements)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(advertisements.ToPublic())
}

func SearchAdvertisements(c *fiber.Ctx) error {
	title := c.Query("title")
	zipCode := c.Query("zip-code")
	animal := c.Query("animal")

	var advertisements []models.Advertisement

	dbInstance := database.GetDB()
	dbQuery := dbInstance.Preload("User").Model(&advertisements)

	if title != "" {
		dbQuery.Where("UPPER(title) LIKE UPPER(?)", "%"+title+"%")
	}

	if zipCode != "" {
		dbQuery.Joins("LEFT JOIN users ON users.id = advertisements.user_id").Where("users.zip_code = ?", zipCode)
	}

	if animal != "" {
		dbQuery.Where("animal = ?", animal)
	}

	result := dbQuery.Find(&advertisements)
	if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	var publicAdvertisementsList []models.PublicAdvertisement

	for _, advertisement := range advertisements {
		publicAdvertisementsList = append(publicAdvertisementsList, advertisement.ToPublic())
	}

	return c.Status(fiber.StatusOK).JSON(publicAdvertisementsList)
}
