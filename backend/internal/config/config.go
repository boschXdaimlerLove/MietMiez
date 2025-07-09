package config

import (
	"github.com/alexedwards/argon2id"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"log/slog"
	"os"
	"runtime"
	"time"

	"github.com/kelseyhightower/envconfig"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

var Cfg Config

// The Config contains options to adjust smtp, server, database and minio settings
//
//goland:noinspection ALL
type Config struct {
	Smtp struct {
		Host     string `envconfig:"SMTP_HOST"`
		Port     string `envconfig:"SMTP_PORT"`
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

// GetArgon2Config config options for argon2id depending on whether the server is running in prod or dev mode
// values can be generated with $ docker run -it --entrypoint kratos oryd/kratos:v0.5 hashers argon2 calibrate 1s
func GetArgon2Config() *argon2id.Params {
	var prodConfig *argon2id.Params
	var devConfig *argon2id.Params

	prodConfig = &argon2id.Params{
		Memory:      1048576, // 1GiB
		Iterations:  1,
		Parallelism: uint8(runtime.NumCPU()),
		SaltLength:  16,
		KeyLength:   32,
	}

	devConfig = &argon2id.Params{
		Memory:      64 * 1024,
		Iterations:  1,
		Parallelism: uint8(runtime.NumCPU()),
		SaltLength:  16,
		KeyLength:   32,
	}

	if Cfg.Server.Production {
		return prodConfig
	} else {
		return devConfig
	}
}
