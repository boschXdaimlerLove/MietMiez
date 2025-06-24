package util

import (
	"boschXdaimlerLove/MietMiez/internal/database"
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// GetRequestUser if the user provides a valid session cookie in the request, the user object will be returned
func GetRequestUser(c *fiber.Ctx) (bool, models.User) {
	var session models.Session

	if c.Cookies("session") == "" {
		return false, models.User{}
	}

	dbInstance := database.GetDB()
	result := dbInstance.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Where("id = ?", c.Cookies("session")).
		Where("valid_until > ?", time.Now()).
		First(&session)

	//Logger.Info().Any("user", session.User).Any("session", session).Msg("GetRequestUser")

	if result.Error != nil {
		//if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		//	Logger.Err(result.Error).Msg("GetRequestUser failed")
		//}
		return false, models.User{}
	}

	return true, session.User
}

// InvalidateSession remove session token from the db and therefore invalidate it
func InvalidateSession(c *fiber.Ctx) error {
	dbInstance := database.GetDB()

	Logger.Debug().Str("session", c.Cookies("session")).Msg("invalidating session")

	if c.Cookies("session") == "" {
		return nil
	}

	result := dbInstance.Delete(&models.Session{}, "ID = ?", c.Cookies("session"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("InvalidateSession failed")
		return result.Error
	}
	return nil
}
