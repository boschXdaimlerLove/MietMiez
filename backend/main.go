package main

import (
	"boschXdaimlerLove/MietMiez/routes"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"
import . "boschXdaimlerLove/MietMiez/internal/config"
import . "boschXdaimlerLove/MietMiez/internal/database"

func main() {
	SetupLogger()
	Logger.Info().Msg("Server starting!")
	SetupConfig()
	ConnectDB()
	
	// setup http server
	app := fiber.New()
	routes.SetupRoutes(app)

	err := app.Listen(":" + strconv.Itoa(Cfg.Server.Port))
	if err != nil {
		Logger.Fatal().Err(err).Msg("Failed to start server with port: " + strconv.Itoa(Cfg.Server.Port))
	}
}
