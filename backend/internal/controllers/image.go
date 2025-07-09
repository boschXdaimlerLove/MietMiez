package controllers

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	minioclient "boschXdaimlerLove/MietMiez/internal/minio"
	"boschXdaimlerLove/MietMiez/internal/util"
	"bytes"
	"context"
	"crypto/sha256"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
	"time"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

func UploadImage(c *fiber.Ctx) error {
	isAuthenticated, user := util.GetRequestUser(c)
	if !isAuthenticated {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// 1) FormFile öffnen
	file, err := c.FormFile("document")
	if err != nil {
		Logger.Err(err).Msg("Error uploading image")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	// 2) multipart.File öffnen
	src, err := file.Open()
	if err != nil {
		Logger.Err(err).Msg("Error opening image buffer")
		return c.SendStatus(fiber.StatusBadRequest)
	}
	defer func(src multipart.File) {
		err := src.Close()
		if err != nil {

		}
	}(src)

	// 3) In einen bytes.Buffer kopieren
	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, src); err != nil {
		Logger.Err(err).Msg("Error reading file into buffer")
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	if _, err := io.Copy(buf, bytes.NewReader([]byte(user.Email+strconv.FormatInt(time.Now().UnixNano(), 10)))); err != nil {
		Logger.Err(err).Msg("Error reading file into buffer")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// 4) Hash berechnen
	hash := sha256.Sum256(buf.Bytes())
	ending := ""
	parts := strings.Split(file.Filename, ".")
	if len(parts) > 1 {
		ending = parts[len(parts)-1]
	}
	objectName := fmt.Sprintf("%x.%s", hash, ending)
	Logger.Debug().Str("objectName", objectName).Msg("Uploading image to minio...")

	// 5) Für PutObject einen neuen Reader erzeugen
	reader := bytes.NewReader(buf.Bytes())
	contentType := file.Header.Get("Content-Type")
	fileSize := int64(buf.Len())

	// 6) Upload
	object, err := minioclient.Client.PutObject(
		context.Background(),
		config.Cfg.Minio.BucketName,
		objectName,
		reader,
		fileSize,
		minio.PutObjectOptions{ContentType: contentType},
	)
	if err != nil {
		Logger.Err(err).Msg("Error uploading image to minio")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	Logger.Info().Any("object", object).Msg("Uploaded image to minio")

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id": objectName,
	})
}

func DownloadImage(c *fiber.Ctx) error {
	object, err := minioclient.Client.GetObject(context.Background(), config.Cfg.Minio.BucketName, c.Params("id"), minio.GetObjectOptions{})
	if err != nil {
		Logger.Err(err).Msg("Error downloading image from minio")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	err = c.SendStream(object)
	if err != nil {
		Logger.Err(err).Msg("Error sending stream to client")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}
