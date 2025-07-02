package util

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"fmt"
	"net/smtp"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// this has to be implemented in the ui accordingly!!!
const passwordResetEmailTemplate = "Das ist eine coole ResetEmailVorlage!! hier ist dein Link: https://mietmiez.com/passwordReset?token=%s"
const userActivationEmailTemplate = "Das ist eine coole ActivateUserVorlage!!!!!!! Hier ist dein Link: https://mietmiez.com/activateUser/%s"

func sendMail(msg string, receiver []string) error {
	auth := smtp.PlainAuth("", config.Cfg.Smtp.Username, config.Cfg.Smtp.Password, config.Cfg.Smtp.Host)
	err := smtp.SendMail(config.Cfg.Smtp.Host, auth, config.Cfg.Smtp.From, receiver, []byte(msg))
	if err != nil {
		Logger.Err(err).Str("message", msg).Msg("Send email fail")
		return err
	}
	return nil
}

// SendResetMail wrapper for sendMail
func SendResetMail(token string, receiver string) error {
	msg := fmt.Sprintf(passwordResetEmailTemplate, token)
	if config.Cfg.Server.Production {
		err := sendMail(msg, []string{receiver})
		return err
	} else {
		Logger.Warn().Str("token", token).Msg("Email password reset is disabled; here is your token")
		return nil
	}
}

func SendUserActivationMail(token string, receiver string) {
	var count uint8 = 1
	Logger.Debug().Str("token", token).Msg("Start sending activation email")
	msg := fmt.Sprintf(userActivationEmailTemplate, token)
	if config.Cfg.Server.Production {
		for count <= 3 {
			err := sendMail(msg, []string{receiver})
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
