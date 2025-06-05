package logger

import (
	"github.com/rs/zerolog"
	"os"
)

var Logger zerolog.Logger

func SetupLogger() {
	// setup logger
	consoleWriter := zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: "[2006/01/02 15:04:05]",
		FormatLevel: func(i interface{}) string {
			return "[" + i.(string) + "]"
		},
	}
	Logger = zerolog.New(consoleWriter).With().Timestamp().Logger()
}
