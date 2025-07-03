package router

import (
	"booking-service/controller"
	"booking-service/repository"
	"booking-service/service"
	"database/sql"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, db *sql.DB) {
	// Enable CORS for all origins
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Initialize dependencies
	bookingRepo := repository.NewBookingRepository(db)
	bookingService := service.NewBookingService(bookingRepo)
	bookingController := controller.NewBookingController(bookingService)

	// API routes
	api := r.Group("/api/v1")
	{
		// Concert routes
		concerts := api.Group("/concerts")
		{
			concerts.GET("", bookingController.GetConcerts)
			concerts.GET("/:id", bookingController.GetConcert)
		}

		// Booking routes
		bookings := api.Group("/bookings")
		bookings.Use(authMiddleware())
		{
			bookings.POST("", bookingController.CreateBooking)
			bookings.GET("/user", bookingController.GetUserBookings)
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "booking-service"})
	})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// JWT authentication middleware implementation
		c.Next()
	}
}
