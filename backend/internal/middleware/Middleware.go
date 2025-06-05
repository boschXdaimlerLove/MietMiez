package middleware

import (
	"github.com/gofiber/fiber/v2"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func ZerologMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next() // Process request

		latency := time.Since(start)
		status := c.Response().StatusCode()

		Logger.Debug().
			Str("method", c.Method()).
			Str("path", c.OriginalURL()).
			Int("status", status).
			Dur("latency", latency).
			Msg("request completed")

		return err
	}
}
