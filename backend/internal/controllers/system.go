package controllers

import (
	"github.com/gofiber/fiber/v2"
	"os"
)

func Health(c *fiber.Ctx) error {
	return c.SendStatus(200)
}

func OpenApiSpecs(c *fiber.Ctx) error {
	data, err := os.ReadFile("./openapi_v1.yml")
	if err != nil {
		return c.SendStatus(500)
	}
	return c.Send(data)
}

func GetAboutInformation(c *fiber.Ctx) error {
	data, err := os.ReadFile("./about.json")
	if err != nil {
		return c.SendStatus(500)
	}
	return c.Send(data)
}
