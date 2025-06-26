package minio

import (
	"boschXdaimlerLove/MietMiez/internal/config"
	"context"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

import . "boschXdaimlerLove/MietMiez/internal/logger"

var Client *minio.Client

func InitMinio() {
	ctx := context.Background()
	var err error

	Logger.Debug().Msg("Trying to connect to minio")
	Client, err = minio.New(config.Cfg.Minio.Hostname, &minio.Options{
		Creds:  credentials.NewStaticV4(config.Cfg.Minio.RootUser, config.Cfg.Minio.RootPassword, ""),
		Secure: config.Cfg.Minio.UseSSL,
	})
	if err != nil {
		Logger.Err(err).Msg("Client failed to connect")
	}

	location := "eu-west-1"

	err = Client.MakeBucket(ctx, config.Cfg.Minio.BucketName, minio.MakeBucketOptions{Region: location})
	if err != nil {
		// Check to see if we already own this bucket (which happens if you run this twice)
		exists, errBucketExists := Client.BucketExists(ctx, config.Cfg.Minio.BucketName)
		if errBucketExists == nil && exists {
			Logger.Info().Str("bucketname", config.Cfg.Minio.BucketName).Msg("minio bucket already exists")
		} else {
			Logger.Err(err).Msg("Client.BucketExists failed")
		}
	} else {
		Logger.Info().Str("bucketname", config.Cfg.Minio.BucketName).Msg("Successfully created bucket")
	}
}
