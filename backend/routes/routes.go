package routes

import (
	"boschXdaimlerLove/MietMiez/internal/controllers"
	"boschXdaimlerLove/MietMiez/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func setupV1Routes(app *fiber.App) {
	Logger.Debug().Msg("Setting up v1 routes")
	v1 := app.Group("/v1")
	v1.Get("/health", controllers.Health)
}

func SetupRoutes(app *fiber.App) {
	// setting up logger to log all requests
	Logger.Debug().Msg("Setting up logging middleware")
	app.Use(middleware.ZerologMiddleware())

	// registering v1 api
	setupV1Routes(app)
	// space for SetupV2Routes
}
