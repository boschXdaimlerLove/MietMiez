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

	dbInstance := database.GetDB()
	result := dbInstance.First(&session, "ID = ? AND ValidUntil > ?", c.Cookies("session"), time.Now())
	if result.Error != nil {
		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			Logger.Err(result.Error).Msg("GetRequestUser failed")
		}
		return false, models.User{}
	}

	return true, session.User
}

// InvalidateSession remove session token from the db and therefore invalidate it
func InvalidateSession(c *fiber.Ctx) error {
	dbInstance := database.GetDB()
	result := dbInstance.Delete(models.Session{}, "ID = ?", c.Cookies("session"))
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil
	} else if result.Error != nil {
		Logger.Err(result.Error).Msg("InvalidateSession failed")
		return result.Error
	}
	return nil
}
