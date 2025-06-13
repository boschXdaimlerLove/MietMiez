package database

import (
	"boschXdaimlerLove/MietMiez/internal/database/models"
)
import . "boschXdaimlerLove/MietMiez/internal/logger"

var migrationsList = []interface{}{
	&models.Advertisement{},
	&models.Category{},
	&models.PasswordResetToken{},
	&models.Session{},
	&models.User{},
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
