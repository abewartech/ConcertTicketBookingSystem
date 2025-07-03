package service

import (
	"booking-service/model"
	"booking-service/repository"
	"errors"

	"github.com/sirupsen/logrus"
)

type BookingService struct {
	repo *repository.BookingRepository
}

func NewBookingService(repo *repository.BookingRepository) *BookingService {
	return &BookingService{repo: repo}
}

func (s *BookingService) GetConcerts() ([]*model.Concert, error) {
	return s.repo.GetConcerts()
}

func (s *BookingService) GetConcertByID(id int) (*model.Concert, error) {
	return s.repo.GetConcertByID(id)
}

func (s *BookingService) CreateBooking(userID int, req *model.BookingRequest) (*model.BookingResponse, error) {
	// Get concert details
	concert, err := s.repo.GetConcertByID(req.ConcertID)
	if err != nil {
		return nil, err
	}
	if concert == nil {
		return nil, errors.New("concert not found")
	}

	// Check seat availability
	if concert.AvailSeats < req.Quantity {
		return nil, errors.New("not enough seats available")
	}

	// Calculate total price
	totalPrice := concert.Price * float64(req.Quantity)

	// Create booking
	booking := &model.Booking{
		UserID:     userID,
		ConcertID:  req.ConcertID,
		Quantity:   req.Quantity,
		TotalPrice: totalPrice,
		Status:     "pending",
	}

	// Start transaction (simplified for this example)
	err = s.repo.CreateBooking(booking)
	if err != nil {
		return nil, err
	}

	// Update available seats
	err = s.repo.UpdateConcertSeats(req.ConcertID, req.Quantity)
	if err != nil {
		logrus.Error("Failed to update concert seats: ", err)
		return nil, errors.New("booking failed")
	}

	return &model.BookingResponse{
		Booking: booking,
		Concert: concert,
	}, nil
}

func (s *BookingService) GetUserBookings(userID int) ([]*model.BookingResponse, error) {
	return s.repo.GetUserBookings(userID)
}