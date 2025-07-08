package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"boschXdaimlerLove/MietMiez/internal/util"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"slices"
	"strconv"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// AdvertisementInformation gets information about specific advertisement
// see [models.Advertisement] for more information about advertisements (same for following functions)
// notice `Atoi` integer conversion -> handling is same in following functions,
// not documentated in api specification because "default server behaviour"
func AdvertisementInformation(c *fiber.Ctx) error {
	var advertisement models.Advertisement
	dbInstance := database.GetDB()

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("id must be an integer")
	}

	result := dbInstance.
		Preload("User").
		First(&advertisement, "id = ?", id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("Failed to get advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(advertisement.ToPublic())
}

// CreateAdvertisement creates new advertisement
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

	imgs := advertisement.Images
	Logger.Info().Any("imgs", imgs).Msg("imgs before sorting")

	if len(imgs) > 0 {
		slices.Sort(imgs)
		Logger.Info().Any("imgs", imgs).Msg("imgs after sorting")

		uniqueImgs := make(datatypes.JSONSlice[string], 0, len(imgs))
		uniqueImgs = append(uniqueImgs, imgs[0])

		for i := 1; i < len(imgs); i++ {
			if imgs[i] != imgs[i-1] {
				uniqueImgs = append(uniqueImgs, imgs[i])
			}
		}

		advertisement.Images = uniqueImgs
		Logger.Info().Any("imgs", uniqueImgs).Msg("unique imgs")
	} else {
		Logger.Trace().Any("advertisement", advertisement).Msg("No images uploaded with advertisement")
	}

	dbInstance := database.GetDB()
	result := dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(&advertisement)
	if result.RowsAffected == 0 {
		Logger.Warn().Interface("advertisement", advertisement).Msg("cannot create new advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusCreated).JSON(advertisement.ToPublic())
}

// UpdateAdvertisement updates specified advertisement, id must be given, new advertisement must be given
func UpdateAdvertisement(c *fiber.Ctx) error {
	var advertisementFromDB, advertisementFromUser models.Advertisement
	dbInstance := database.GetDB()

	isLoggedIn, user := util.GetRequestUser(c)
	if !isLoggedIn {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("id must be an integer")
	}

	result := dbInstance.
		Preload("User").
		Where("id = ?", id).
		First(&advertisementFromDB)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("failed to update advertisement")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if advertisementFromDB.UserID != user.ID {
		return c.SendStatus(fiber.StatusForbidden)
	}

	err = util.GetJsonFromRequest(c, &advertisementFromUser)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// TODO: ads can be created without title, description and specified animal?
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

// GetRecentAdvertisements returns the latest advertisements
// Notice paging
func GetRecentAdvertisements(c *fiber.Ctx) error {
	var advertisements models.AdvertisementList
	dbInstance := database.GetDB()

	page, err := strconv.Atoi(c.Query("page"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("page must be an integer")
	}

	result := dbInstance.Scopes(util.Paginate(page)).Order("created_at desc").Preload("User").Find(&advertisements)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(advertisements.ToPublic())
}

// DeleteAdvertisement deletes specified advertisement, the ad is set as param in url
func DeleteAdvertisement(c *fiber.Ctx) error {
	var userFromDB models.User
	var isAuthenticated bool

	if isAuthenticated, userFromDB = util.GetRequestUser(c); !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("id must be an integer")
	}

	var advertisement models.Advertisement

	result := database.GetDB().
		Preload("User").
		Where("id = ? AND user_id = ?", id, userFromDB.ID).
		First(&advertisement)

	if result.RowsAffected == 0 {
		return c.SendStatus(fiber.StatusNotFound)
	} else if result.Error != nil {
		Logger.Warn().Interface("result", result).Msg("error getting advertisement for deletion")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	go database.GetDB().Delete(&advertisement)

	return c.SendStatus(fiber.StatusOK)
}

// SearchAdvertisements searches all advertisements with title or zip-code or animal
func SearchAdvertisements(c *fiber.Ctx) error {
	title := c.Query("title")
	zipCode := c.Query("zip-code")
	animal := c.Query("animal")

	advertisements := make(models.AdvertisementList, 0) // hacky, so the slice is non-nil and empty so fiber doesn't return null

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
		Logger.Err(result.Error).Msg("Failed to search advertisements")
		return c.SendStatus(fiber.StatusInternalServerError)
	} else if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(advertisements)
	}

	publicAdvertisementsList := advertisements.ToPublic()

	return c.Status(fiber.StatusOK).JSON(publicAdvertisementsList)
}
