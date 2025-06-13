package config

import (
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/csrf"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
	"log/slog"
	"os"
	"time"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

var Cfg Config

type Config struct {
	Smtp struct {
		Host     string `yaml:"host" envconfig:"SMTP_HOST"`
		Username string `yaml:"user" envconfig:"SMTP_USER"`
		Password string `yaml:"password" envconfig:"SMTP_PASSWORD"`
		From     string `yaml:"from" envconfig:"SMTP_FROM"`
	}

	Server struct {
		TokenLength     int
		SessionDuration time.Duration
		Port            int    `yaml:"port" envconfig:"BACKEND_PORT"`
		CookieKey       string `yaml:"cookie_key" envconfig:"BACKEND_COOKIE_KEY"` // MUST BE 32 CHAR STRING!!!!
		Production      bool   `yaml:"production" envconfig:"BACKEND_PRODUCTION"`
	} `yaml:"backend"`

	Database struct {
		Username string `yaml:"user" envconfig:"DB_USERNAME"`
		Password string `yaml:"password" envconfig:"DB_PASSWORD"`
		Hostname string `yaml:"hostname" envconfig:"DB_HOSTNAME"`
		Port     int    `yaml:"port" envconfig:"DB_PORT"`
		Dbname   string `yaml:"dbname" envconfig:"DB_NAME"`
	} `yaml:"database"`
}

func readConfigFile(cfg *Config) {
	f, err := os.Open("./config.yml")
	if err != nil {
		slog.Error(err.Error())
		os.Exit(2)
	}
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			Logger.Err(err).Msg("Error closing config file")
		}
	}(f)

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(cfg)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(2)
	}
}

func readConfigEnv(cfg *Config) {
	err := envconfig.Process("", cfg)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(2)
	}
}

func SetupConfig() {
	Logger.Info().Msg("Reading config")
	Cfg = Config{}
	readConfigFile(&Cfg)
	readConfigEnv(&Cfg)
	Cfg.Server.TokenLength = 32
	Cfg.Server.SessionDuration = time.Hour * 24 * 7 // 7 days cookie
	Logger.Info().Any("config", Cfg).Msg("Config loaded!")
}

// GetCompressionConfig https://docs.gofiber.io/api/middleware/compress
func GetCompressionConfig() compress.Config {
	return compress.Config{
		Level: compress.LevelBestSpeed,
	}
}

// GetCookieEncryptionConfig https://docs.gofiber.io/api/middleware/encryptcookie
func GetCookieEncryptionConfig() encryptcookie.Config {
	return encryptcookie.Config{
		Key:    Cfg.Server.CookieKey,                    // MUST BE 32 CHAR STRING
		Except: []string{csrf.ConfigDefault.CookieName}, // exclude CSRF cookie
	}
}

// GetCSRFConfig https://docs.gofiber.io/api/middleware/csrf
func GetCSRFConfig() csrf.Config {
	return csrf.Config{
		KeyLookup:      "header:" + csrf.HeaderName,
		CookieSameSite: "Strict",
		CookieSecure:   Cfg.Server.Production,
		CookieHTTPOnly: false,
	}
}
