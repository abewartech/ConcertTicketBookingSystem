package main

import (
	"booking-service/config"
	"booking-service/router"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func main() {
	// Initialize configuration
	cfg := config.Load()

	// Initialize logger
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

	// Initialize database
	db := config.InitDB(cfg)
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Setup routes
	router.SetupRoutes(r, db)

	// Start server
	logrus.WithField("port", cfg.Port).Info("Starting booking service")
	log.Fatal(r.Run(":" + cfg.Port))
}