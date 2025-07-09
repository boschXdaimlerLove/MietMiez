package util

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"crypto/rand"
	"encoding/base64"
	"github.com/alexedwards/argon2id"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// HashPassword returns salt, hash, error
func HashPassword(password string) (string, error) {
	hash, err := argon2id.CreateHash(password, config.GetArgon2Config())
	if err != nil {
		Logger.Err(err).Msg("Error calculating hash")
		return "", err
	}

	return hash, nil
}

func CheckPasswordHash(password string, hash string) (bool, error) {
	match, err := argon2id.ComparePasswordAndHash(password, hash)
	if err != nil {

		Logger.Err(err).Str("hash", hash).Str("password", password).Msg("Error comparing hash")
		return false, err
	}
	return match, nil
}

func GetRandomText(length int) string {
	b := make([]byte, length)
	_, _ = rand.Read(b) // Read always succeeds according to their docs
	return base64.URLEncoding.EncodeToString(b)
}
