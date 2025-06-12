package util

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"fmt"
	"net/smtp"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

// this has to be implemented in the ui accordingly!!!
const passwordResetEmailTemplate = "Das ist eine coole ResetEmailVorlage!! hier ist dein Link: https://mietmiez.com/passwordReset?token=%s"

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
	err := sendMail(msg, []string{receiver})
	if err != nil {
		return err
	}
	return nil
}
