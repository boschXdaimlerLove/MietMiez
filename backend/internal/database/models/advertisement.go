package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Advertisement struct {
	// gorm.Model includes Created-At, Updated-At, Deleted-At, as well as an ID (int)
	gorm.Model
	User        User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID      uint
	Title       string                      `json:"title"`
	Description string                      `json:"description"`
	Animal      string                      `json:"animal"`
	Images      datatypes.JSONSlice[string] `gorm:"type:jsonb"`
}

type PublicAdvertisement struct {
	ID          uint                        `json:"id"`
	User        PublicUser                  `json:"user"`
	Title       string                      `json:"title"`
	Description string                      `json:"description"`
	Animal      string                      `json:"animal"`
	Images      datatypes.JSONSlice[string] `json:"images"`
}

func (advertisement *Advertisement) ToPublic() PublicAdvertisement {
	return PublicAdvertisement{
		ID:          advertisement.ID,
		User:        advertisement.User.ToPublic(),
		Title:       advertisement.Title,
		Description: advertisement.Description,
		Animal:      advertisement.Animal,
		Images:      advertisement.Images,
	}
}

type AdvertisementList []Advertisement

func (advertisements AdvertisementList) ToPublic() []PublicAdvertisement {
	publicAds := make([]PublicAdvertisement, 0)
	for _, e := range advertisements {
		publicAds = append(publicAds, e.ToPublic())
	}
	return publicAds
}
