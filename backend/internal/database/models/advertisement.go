package models

import "gorm.io/gorm"

type Advertisement struct {
	// gorm.Model includes Created-At, Updated-At, Deleted-At, as well as an ID (int)
	gorm.Model
	User        User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID      uint
	Title       string `json:"title"`
	Description string `json:"description"`
	Animal      string `json:"animal"`
	//Images      []string `json:"images"`
}
