package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Title string `json:"title" gorm:"not null;uniqueIndex"`
}

type PublicCategory struct {
	Title string
	ID    uint
}

func (category *Category) ToPublic() PublicCategory {
	return PublicCategory{
		Title: category.Title,
		ID:    category.ID,
	}
}
