package util

import (
	"github.com/gofiber/fiber/v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// GetJsonFromRequest return the interface object from web request in json
func GetJsonFromRequest(c *fiber.Ctx, v interface{}) error {
	if err := c.BodyParser(v); err != nil {
		Logger.Err(err).Str("body", string(c.Body())).Msg("Fiber Body Parser failed")
		return err
	}
	return nil
}
