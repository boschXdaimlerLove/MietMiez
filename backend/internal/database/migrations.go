package database

import (
	"boschXdaimlerLove/MietMiez/internal/database/models"
	"gorm.io/gorm/clause"
)
import . "boschXdaimlerLove/MietMiez/internal/logger"

var migrationsList = []interface{}{
	&models.Advertisement{},
	&models.Category{},
	&models.Favourite{},
	&models.PasswordResetToken{},
	&models.UserActivationToken{},
	&models.Session{},
	&models.User{},
}

var categoryList = []string{
	"Cats",
	"Dogs",
	"Monkeys",
	"Fish",
	"Mouses",
	"Chickens",
	"Horses",
	"Birds",
	"Snakes",
	"Cuddle Toy",
	"Edible", // yummy cat
	"Giraffe",
}

// Create all categories that don't exist already (needed for future migration)
// Deletion of categories must be done manually
func insertCategories() {
	var categories []models.Category
	for _, category := range categoryList {
		categories = append(categories, models.Category{Title: category})
	}
	dbInstance.Clauses(clause.OnConflict{DoNothing: true}).Create(&categories)
}

// perform the migrations for all models
func performMigrations() {
	for _, migration := range migrationsList {
		err := dbInstance.AutoMigrate(migration)
		if err != nil {
			Logger.Panic().Err(err).Msg("Failed to perform auto migration")
		}
	}

	Logger.Debug().Msg("Successfully performed auto migration")
}
