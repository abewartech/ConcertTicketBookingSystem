package model

import (
	"time"
)

type Concert struct {
	ID          int       `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Artist      string    `json:"artist" db:"artist"`
	Venue       string    `json:"venue" db:"venue"`
	Date        time.Time `json:"date" db:"date"`
	Price       float64   `json:"price" db:"price"`
	TotalSeats  int       `json:"total_seats" db:"total_seats"`
	AvailSeats  int       `json:"available_seats" db:"available_seats"`
	Description string    `json:"description" db:"description"`
	ImageURL    string    `json:"image_url" db:"image_url"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type Booking struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	ConcertID int       `json:"concert_id" db:"concert_id"`
	Quantity  int       `json:"quantity" db:"quantity"`
	TotalPrice float64  `json:"total_price" db:"total_price"`
	Status    string    `json:"status" db:"status"` // pending, confirmed, cancelled
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type BookingRequest struct {
	ConcertID int `json:"concert_id" binding:"required"`
	Quantity  int `json:"quantity" binding:"required,min=1"`
}

type BookingResponse struct {
	Booking *Booking `json:"booking"`
	Concert *Concert `json:"concert"`
}