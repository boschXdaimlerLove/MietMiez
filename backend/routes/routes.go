package routes

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"boschXdaimlerLove/MietMiez/internal/controllers"
	"boschXdaimlerLove/MietMiez/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func setupV1Routes(app *fiber.App) {
	Logger.Debug().Msg("Setting up v1 routes")
	v1 := app.Group("/v1")
	v1.Get("/health", controllers.Health)

	// --- user paths ---
	v1.Post("/user", controllers.UserCreate)
	v1.Delete("/user", controllers.UserDelete)
	v1.Put("/user/update", controllers.UserUpdate)
	v1.Get("/user/:user", controllers.UserInfo)
	v1.Post("/user/login", controllers.UserLogin)
	v1.Post("/user/logout", controllers.UserLogout)

	v1.Post("/user/reset-password", controllers.UserResetPassword)
	v1.Get("/user/favorites", controllers.UserGetFavorites)
	v1.Post("/user/favorites", controllers.UserAddFavorite)

	// --- advertisement paths ---
	// TODO add advertisement paths
}

func SetupRoutes(app *fiber.App) {
	// setting up logger to log all requests
	Logger.Debug().Msg("Setting up middlewares")

	// enable compression
	app.Use(compress.New(config.GetCompressionConfig()))

	// encrypt cookie
	app.Use(encryptcookie.New(config.GetCookieEncryptionConfig()))

	// set csrf cookie
	//app.Use(csrf.New(config.GetCSRFConfig()))

	// enable logging of requests
	app.Use(middleware.LoggingMiddleware())

	// registering v1 api
	setupV1Routes(app)
	// space for SetupV2Routes
}
