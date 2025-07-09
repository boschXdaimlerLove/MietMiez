package models

import "gorm.io/gorm"

// Favourite is used to store user specified favourites
// warning for older db: unique user id with ad id was added later, possible PostgreSQL panic
type Favourite struct {
	gorm.Model
	UserID          uint          `gorm:"index:idx_user_advertisement,unique"`
	User            User          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	AdvertisementID uint          `gorm:"index:idx_user_advertisement,unique"`
	Advertisement   Advertisement `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
