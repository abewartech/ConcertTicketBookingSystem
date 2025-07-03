package controller

import (
	"net/http"
	"payment-service/model"
	"payment-service/service"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type PaymentController struct {
	service *service.PaymentService
}

func NewPaymentController(service *service.PaymentService) *PaymentController {
	return &PaymentController{service: service}
}

func (c *PaymentController) CreatePayment(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id, ok := userID.(int)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	var req model.PaymentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		logrus.Error("Invalid request body: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payment, err := c.service.CreatePayment(id, &req)
	if err != nil {
		logrus.Error("Failed to create payment: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	ctx.JSON(http.StatusCreated, payment)
}

func (c *PaymentController) GetPayment(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID"})
		return
	}

	payment, err := c.service.GetPaymentByID(id)
	if err != nil {
		logrus.Error("Failed to get payment: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get payment"})
		return
	}

	if payment == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"payment": payment})
}

func (c *PaymentController) GetUserPayments(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id, ok := userID.(int)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	payments, err := c.service.GetUserPayments(id)
	if err != nil {
		logrus.Error("Failed to get user payments: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get payments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"payments": payments})
}

func (c *PaymentController) HandleWebhook(ctx *gin.Context) {
	// Handle Stripe webhook
	// This would include signature verification and event processing
	ctx.JSON(http.StatusOK, gin.H{"received": true})
}