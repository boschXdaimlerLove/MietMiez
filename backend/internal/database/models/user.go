package models

import (
	"gorm.io/gorm"
	"time"
)

// User NEVER do we give this object out of the api and print it to the user!!!
// it will leak critical data (hash, salt, created-at, ...)
// use the conversion method user.ToPublic()!!!!!!!!!
type User struct {
	gorm.Model
	FirstName string `json:"first-name"`
	LastName  string `json:"last-name"`
	Username  string `json:"username" gorm:"uniqueIndex"`
	Email     string `json:"email" gorm:"uniqueIndex"`
	City      string `json:"city"`
	ZipCode   string `json:"zip-code"`
	Hash      string `json:"password"`
	Salt      string
}

// ToPublic convert a user object (with hash, salt, id and so on) to a public user object which only contains non senstitive data
func (u *User) ToPublic() PublicUser {
	return PublicUser{
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Username:  u.Username,
		Email:     u.Email,
		City:      u.City,
		ZipCode:   u.ZipCode,
	}
}

type PublicUser struct {
	FirstName string `json:"first-name"`
	LastName  string `json:"last-name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	City      string `json:"city"`
	ZipCode   string `json:"zip-code"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// TODO maybe remove
type LoginResponse struct {
	Token     string `json:"token"`
	ExpiresIn int64  `json:"expires_in"`
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
