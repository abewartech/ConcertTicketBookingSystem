package controller

import (
	"booking-service/model"
	"booking-service/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type BookingController struct {
	service *service.BookingService
}

func NewBookingController(service *service.BookingService) *BookingController {
	return &BookingController{service: service}
}

func (c *BookingController) GetConcerts(ctx *gin.Context) {
	concerts, err := c.service.GetConcerts()
	if err != nil {
		logrus.Error("Failed to get concerts: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get concerts"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"concerts": concerts})
}

func (c *BookingController) GetConcert(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid concert ID"})
		return
	}

	concert, err := c.service.GetConcertByID(id)
	if err != nil {
		logrus.Error("Failed to get concert: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get concert"})
		return
	}

	if concert == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Concert not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"concert": concert})
}

func (c *BookingController) CreateBooking(ctx *gin.Context) {
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

	var req model.BookingRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		logrus.Error("Invalid request body: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking, err := c.service.CreateBooking(id, &req)
	if err != nil {
		logrus.Error("Failed to create booking: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, booking)
}

func (c *BookingController) GetUserBookings(ctx *gin.Context) {
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

	bookings, err := c.service.GetUserBookings(id)
	if err != nil {
		logrus.Error("Failed to get user bookings: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bookings"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bookings": bookings})
}