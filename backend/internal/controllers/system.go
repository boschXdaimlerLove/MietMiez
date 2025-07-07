package controllers

import (
	"github.com/gofiber/fiber/v2"
	"os"
)

// Health returns the status of the server
// used for docker deploy health checks
func Health(c *fiber.Ctx) error {
	return c.SendStatus(200)
}

// OpenApiSpecs returns the api specification
// before change docker-compose.yaml: change file path here!
func OpenApiSpecs(c *fiber.Ctx) error {
	data, err := os.ReadFile("./openapi_v1.yml")
	if err != nil {
		return c.SendStatus(500)
	}
	return c.Send(data)
}

// GetAboutInformation returns a JSON object with static context
// can be edited by hoster!
func GetAboutInformation(c *fiber.Ctx) error {
	data, err := os.ReadFile("./about.json")
	if err != nil {
		return c.SendStatus(500)
	}
	return c.Send(data)
}
