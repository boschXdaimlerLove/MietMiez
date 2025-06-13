package util

import (
	"crypto/rand"
	"encoding/base64"
	"github.com/alexedwards/argon2id"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// HashPassword returns hash, salt, error
func HashPassword(password string) (string, string, error) {
	salt := GetRandomText(32) // 26 char text
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

		Logger.Err(err).Str("hash", hash).Str("password", password).Str("Salt", salt).Msg("Error comparing hash")
		return false, err
	}
	return match, nil
}

func GetRandomText(length int) string {
	b := make([]byte, length)
	_, _ = rand.Read(b) // Read always succeeds according to their docs
	return base64.URLEncoding.EncodeToString(b)
}
