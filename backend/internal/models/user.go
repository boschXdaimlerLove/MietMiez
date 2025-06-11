package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName string `json:"first-name"`
	LastName  string `json:"last-name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	City      string `json:"city"`
	ZipCode   string `json:"zip-code"`
	Password  string `json:"password"`
	Salt      string
}
