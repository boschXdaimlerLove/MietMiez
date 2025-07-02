package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/config"
import . "boschXdaimlerLove/MietMiez/internal/logger"

// dbInstance Declare the variable for the database
var dbInstance *gorm.DB

// ConnectDB connect to db
func ConnectDB() {
	var err error
	// Connection URL to connect to Postgres Database
	dbconf := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", Cfg.Database.Hostname, Cfg.Database.Port, Cfg.Database.Username, Cfg.Database.Password, Cfg.Database.Dbname)
	// Connect to the DB and initialize the DB variable
	dbInstance, err = gorm.Open(postgres.Open(dbconf), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		Logger.Panic().Err(err).Msg("Failed to connect to database")
	}
	Logger.Debug().Msg("Successfully connected to database")

	performMigrations()
	insertCategories()

	sqlDB, err := dbInstance.DB()
	if err != nil {
		Logger.Panic().Err(err).Msg("Failed to create sqlDB object")
	}

	sqlDB.SetMaxIdleConns(20)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	Logger.Debug().Msg("DB connection pool setup")

	Logger.Info().Msg("Database setup successful!")
}

func GetDB() *gorm.DB {
	return dbInstance
}
