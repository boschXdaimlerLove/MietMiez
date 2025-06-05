package config

import (
	"log/slog"
	"os"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

var Cfg Config

type Config struct {
	Server struct {
		Port int `yaml:"port" envconfig:"BACKEND_PORT"`
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
	defer f.Close()

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
	Logger.Info().Any("config", Cfg).Msg("Config loaded!")
}
