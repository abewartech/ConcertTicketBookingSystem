package router

import (
	"database/sql"
	"payment-service/controller"
	"payment-service/repository"
	"payment-service/service"

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
	paymentRepo := repository.NewPaymentRepository(db)
	paymentService := service.NewPaymentService(paymentRepo, "your-stripe-secret-key")
	paymentController := controller.NewPaymentController(paymentService)

	// API routes
	api := r.Group("/api/v1")
	{
		// Payment routes
		payments := api.Group("/payments")
		payments.Use(authMiddleware())
		{
			payments.POST("", paymentController.CreatePayment)
			payments.GET("/:id", paymentController.GetPayment)
			payments.GET("/user", paymentController.GetUserPayments)
		}

		// Webhook route (no auth required)
		api.POST("/webhook/stripe", paymentController.HandleWebhook)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "payment-service"})
	})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// JWT authentication middleware implementation
		c.Next()
	}
}
