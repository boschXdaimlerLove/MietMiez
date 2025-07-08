package models

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	minioclient "boschXdaimlerLove/MietMiez/internal/minio"
	"context"
	"github.com/minio/minio-go/v7"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

type Advertisement struct {
	// gorm.Model includes Created-At, Updated-At, Deleted-At, as well as an ID (int)
	gorm.Model
	User        User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID      uint
	Title       string                      `json:"title"`
	Description string                      `json:"description"`
	Animal      string                      `json:"animal"`
	Images      datatypes.JSONSlice[string] `gorm:"type:jsonb" json:"images"`
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

func (advertisement *Advertisement) BeforeDelete(db *gorm.DB) (err error) {
	Logger.Trace().Strs("names", advertisement.Images).Msg("removing images from minio")
	for _, name := range advertisement.Images {
		err := minioclient.Client.RemoveObject(context.Background(), config.Cfg.Minio.BucketName, name, minio.RemoveObjectOptions{})
		if err != nil {
			Logger.Warn().Err(err).Interface("advertisement", advertisement).Msg("error removing image from minio while deleting ad")
		}
	}
	return nil
}
