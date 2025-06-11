package util

import (
	"crypto/rand"
	"github.com/alexedwards/argon2id"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// HashPassword returns hash, salt, error
func HashPassword(password string) (string, string, error) {
	salt := rand.Text() // 26 char text
	hash, err := argon2id.CreateHash(password+salt, argon2id.DefaultParams)
	if err != nil {
		Logger.Err(err).Msg("Error calculating hash")
		return "", "", err
	}

	return salt, hash, nil
}

func CheckPasswordHash(password string, hash string, salt string) (bool, error) {
	match, err := argon2id.ComparePasswordAndHash(password+salt, hash)
	if err != nil {
		Logger.Err(err).Msg("Error comparing hash")
		return false, err
	}
	return match, nil
}
