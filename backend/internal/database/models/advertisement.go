package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"time"
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

func (a *Advertisement) Timestamp() *Advertisement {
	a.CreatedAt = time.Now()
	return a
}

func (a *Advertisement) AddUser(user *User) *Advertisement {
	a.User = *user
	return a
}
