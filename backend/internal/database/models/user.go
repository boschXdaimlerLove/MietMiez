package models

import (
	"gorm.io/gorm"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// User NEVER do we give this object out of the api and print it to the user!!!
// it will leak critical data (hash, salt, created-at, ...)
// use the conversion method user.ToPublic()!!!!!!!!!
type User struct {
	gorm.Model
	FirstName   string `json:"first-name"`
	LastName    string `json:"last-name"`
	Email       string `json:"email" gorm:"uniqueIndex"`
	City        string `json:"city"`
	ZipCode     string `json:"zip-code"`
	Hash        string `json:"password"`
	Salt        string
	IsActivated bool
}

// ToPublic convert a user object (with hash, salt, id and so on) to a public user object which only contains non senstitive data
func (u *User) ToPublic() PublicUser {
	return PublicUser{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		City:      u.City,
		ZipCode:   u.ZipCode,
	}
}

type PublicUser struct {
	ID        uint   `json:"id"`
	FirstName string `json:"first-name"`
	LastName  string `json:"last-name"`
	Email     string `json:"email"`
	City      string `json:"city"`
	ZipCode   string `json:"zip-code"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ChangePasswordRequest struct {
	Email       string `json:"email"`
	OldPassword string `json:"old-password"`
	NewPassword string `json:"new-password"`
}

type PasswordResetRequest struct {
	Email string `json:"email"`
}

type PasswordResetToken struct {
	ID         string `gorm:"primarykey"`
	UserID     uint
	User       User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ValidUntil time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}

type UserActivationToken struct {
	ID         string `gorm:"primarykey"`
	UserID     uint
	User       User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ValidUntil time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}

func (u *User) BeforeDelete(db *gorm.DB) error {
	var ads AdvertisementList
	db.Where("user_id = ?", u.ID).Delete(&ads)
	Logger.Trace().Interface("ads", ads).Msg("ads deleted because of user deletion")

	return nil
}
