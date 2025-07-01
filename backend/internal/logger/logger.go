package logger

import (
	"github.com/rs/zerolog"
	"os"
)

var Logger zerolog.Logger

func SetupLogger() {
	// setup logger with colors for log levels
	consoleWriter := zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: "[2006/01/02 15:04:05]",
		FormatLevel: func(i interface{}) string {
			level := i.(string)
			switch level {
			case "debug":
				return "\033[36m[DEBUG]\033[0m" // Cyan
			case "info":
				return "\033[32m[INFO]\033[0m" // Green
			case "warn":
				return "\033[33m[WARN]\033[0m" // Yellow
			case "error":
				return "\033[31m[ERROR]\033[0m" // Red
			case "fatal":
				return "\033[35m[FATAL]\033[0m" // Magenta
			case "panic":
				return "\033[41m[PANIC]\033[0m" // Red background
			default:
				return "[" + level + "]"
			}
		},
	}

	Logger = zerolog.New(consoleWriter).With().Timestamp().Logger()
}

var logLevels = map[string]zerolog.Level{
	"trace": zerolog.TraceLevel,
	"debug": zerolog.DebugLevel,
	"info":  zerolog.InfoLevel,
	"warn":  zerolog.WarnLevel,
	"error": zerolog.ErrorLevel,
	"fatal": zerolog.FatalLevel,
	"panic": zerolog.PanicLevel,
}

func SetLogLevel(level string) {
	zerolog.SetGlobalLevel(logLevels[level])
	Logger.Info().Any("loglevel", zerolog.GlobalLevel()).Msg("Setting log level")
}
