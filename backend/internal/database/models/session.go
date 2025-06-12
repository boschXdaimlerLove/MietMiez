package models

import (
	"gorm.io/gorm"
	"time"
)

type Session struct {
	ID         string `gorm:"primarykey"`
	UserID     uint
	User       User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ValidUntil time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}
