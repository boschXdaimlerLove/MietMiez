package controllers

import "github.com/gofiber/fiber/v2"

func Health(c *fiber.Ctx) error {
	return c.SendStatus(200)
}
