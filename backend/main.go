package main

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

func main() {
	consoleWriter := zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: "[2006/01/02 15:04:05]",
		FormatLevel: func(i interface{}) string {
			return "[" + i.(string) + "]"
		},
	}
	logger := zerolog.New(consoleWriter).With().Timestamp().Logger()
	logger.Info().Msg("Server starting!")
	var cfg Config
	readConfigFile(&cfg)
	readConfigEnv(&cfg)
	logger.Info().Any("config", cfg).Msg("Config loaded!")

	for {
		time.Sleep(time.Second * 10)
		logger.Warn().Msg("10 seconds elapsed")
	}
}
