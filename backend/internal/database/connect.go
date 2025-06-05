package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

import . "boschXdaimlerLove/MietMiez/internal/config"
import . "boschXdaimlerLove/MietMiez/internal/logger"

// DB Declare the variable for the database
var DB *gorm.DB

// ConnectDB connect to db
func ConnectDB() {
	var err error

	// Connection URL to connect to Postgres Database
	dbconf := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", Cfg.Database.Hostname, Cfg.Database.Port, Cfg.Database.Username, Cfg.Database.Password, Cfg.Database.Dbname)
	// Connect to the DB and initialize the DB variable
	DB, err = gorm.Open(postgres.Open(dbconf))

	if err != nil {
		Logger.Panic().Err(err).Msg("Failed to connect to database")
	}

	Logger.Info().Msg("Database connection successful")
}
