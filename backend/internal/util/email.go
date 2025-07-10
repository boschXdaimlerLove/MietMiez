package util

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"fmt"
	"net/smtp"
	"os"
	"strings"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// sendMail email send helper using values from config
func sendMail(subject, body string, receivers []string) error {
	// Header
	headers := make(map[string]string)
	headers["From"] = config.Cfg.Smtp.From
	headers["To"] = strings.Join(receivers, ", ")
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = `text/html; charset="UTF-8"`

	// format header + body
	var msg strings.Builder
	for k, v := range headers {
		msg.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	msg.WriteString("\r\n")
	msg.WriteString(body)

	// auth + send
	auth := smtp.PlainAuth("", config.Cfg.Smtp.From, config.Cfg.Smtp.Password, config.Cfg.Smtp.Host)
	err := smtp.SendMail(
		config.Cfg.Smtp.Host+":"+config.Cfg.Smtp.Port,
		auth,
		config.Cfg.Smtp.From,
		receivers,
		[]byte(msg.String()),
	)
	if err != nil {
		Logger.Err(err).
			Str("subject", subject).
			Strs("receivers", receivers).
			Msg("Send email fail")
		return err
	}
	return nil
}

// SendResetMail wrapper for sendMail with retries
// func will retry 3 times with delay of
// (n-1)*20 seconds -> n=count of tries
// n=1 -> 0 seconds delay, first try;
// n=2 -> 20 seconds delay, second try (first try threw error)
// n=3 -> 40 seconds delay, third try (first two tries threw errors)
// n=4 -> stop trying
func SendResetMail(token string, receiver string) {
	data, err := os.ReadFile("./email_resetPassword.html")
	if err != nil {
		Logger.Err(err).Msg("Read file email_resetPassword.html fail")
		return
	}

	var count uint8 = 1
	Logger.Debug().Str("token", token).Msg("Start sending pw reset email")
	msg := strings.ReplaceAll(string(data), "{{token}}", token)

	if config.Cfg.Server.Production {
		for count <= 3 {
			err := sendMail("MietMiez Password Reset", msg, []string{receiver})
			if err != nil {
				Logger.Err(err).Uint8("retry count", count).Msg("send pw reset email fail, retrying...")
				for i := uint8(0); i < count; i++ {
					time.Sleep(10 * time.Second)
				}
				count++
			} else {
				Logger.Debug().Str("email", receiver).Uint8("retry count", count).Msg("send reset pw email success")
				break
			}
		}
	} else {
		Logger.Warn().Str("token", token).Msg("Email password reset is disabled; here is your token")
	}
}

// SendUserActivationMail wrapper for sendMail
// func will retry 3 times with delay of
// (n-1)*20 seconds -> n=count of tries
// n=1 -> 0 seconds delay, first try;
// n=2 -> 20 seconds delay, second try (first try threw error)
// n=3 -> 40 seconds delay, third try (first two tries threw errors)
// n=4 -> stop trying
func SendUserActivationMail(token string, receiver string) {
	data, err := os.ReadFile("./email_activateUser.html")
	if err != nil {
		Logger.Err(err).Msg("Read file email_activateUser.html fail")
		return
	}
	var count uint8 = 1
	Logger.Debug().Str("token", token).Msg("Start sending activation email")
	msg := strings.ReplaceAll(string(data), "{{token}}", token)

	if config.Cfg.Server.Production {
		for count <= 3 {
			err := sendMail("MietMiez Account Activation", msg, []string{receiver})
			if err != nil {
				Logger.Err(err).Uint8("retry count", count).Msg("send activation email fail, retrying...")
				for i := uint8(0); i < count; i++ {
					time.Sleep(10 * time.Second)
				}
				count++
			} else {
				Logger.Debug().Str("email", receiver).Uint8("retry count", count).Msg("send activation email success")
				break
			}
		}
	} else {
		Logger.Warn().Str("token", token).Str("email", receiver).Msg("Server not in production mode -> emails disabled; here is your token")
	}
}
