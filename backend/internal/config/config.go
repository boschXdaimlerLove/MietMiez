package config

import (
	"github.com/gofiber/fiber/v2/middleware/compress"
	"log/slog"
	"os"
	"time"

	"github.com/kelseyhightower/envconfig"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

var Cfg Config

// The Config contains options to adjust smtp, server, database and minio settings
type Config struct {
	Smtp struct {
		Host     string `envconfig:"SMTP_HOST"`
		Username string `envconfig:"SMTP_USER"`
		Password string `envconfig:"SMTP_PASSWORD"`
		From     string `envconfig:"SMTP_FROM"`
	}

	Server struct {
		TokenLength            int
		SessionDuration        time.Duration
		Port                   int    `envconfig:"BACKEND_PORT"`
		Production             bool   `envconfig:"BACKEND_PRODUCTION"`
		MaxBodySizeMB          int    `envconfig:"BACKEND_MAX_BODY_SIZE_MB"`
		LogLevel               string `envconfig:"BACKEND_LOG_LEVEL"`
		EnforceEmailActivation bool   `envconfig:"BACKEND_ENFORCE_EMAIL_ACTIVATION"`
	}

	Database struct {
		Username string `envconfig:"POSTGRES_USER"`
		Password string `envconfig:"POSTGRES_PASSWORD"`
		Hostname string `envconfig:"POSTGRES_HOSTNAME"`
		Port     int    `envconfig:"POSTGRES_PORT"`
		Dbname   string `envconfig:"POSTGRES_DB"`
	}

	Minio struct {
		RootUser     string `envconfig:"MINIO_ROOT_USER"`
		RootPassword string `envconfig:"MINIO_ROOT_PASSWORD"`
		BucketName   string `envconfig:"MINIO_BUCKET_NAME"`
		Hostname     string `envconfig:"MINIO_HOSTNAME"`
		UseSSL       bool   `envconfig:"MINIO_USE_SSL"`
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
	readConfigEnv(&Cfg)
	Cfg.Server.TokenLength = 32
	Cfg.Server.SessionDuration = time.Hour * 24 * 7 // 7 days cookie
	Logger.Info().Msg("Config loaded successful!")
}

// GetCompressionConfig https://docs.gofiber.io/api/middleware/compress
func GetCompressionConfig() compress.Config {
	return compress.Config{
		Level: compress.LevelBestSpeed,
	}
}
