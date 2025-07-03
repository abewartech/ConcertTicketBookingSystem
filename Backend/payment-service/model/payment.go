package model

import (
	"time"
)

type Payment struct {
	ID            int       `json:"id" db:"id"`
	BookingID     int       `json:"booking_id" db:"booking_id"`
	UserID        int       `json:"user_id" db:"user_id"`
	Amount        float64   `json:"amount" db:"amount"`
	Currency      string    `json:"currency" db:"currency"`
	Status        string    `json:"status" db:"status"` // pending, completed, failed, refunded
	PaymentMethod string    `json:"payment_method" db:"payment_method"`
	StripeID      string    `json:"stripe_id" db:"stripe_id"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

type PaymentRequest struct {
	BookingID     int    `json:"booking_id" binding:"required"`
	Amount        float64 `json:"amount" binding:"required"`
	Currency      string `json:"currency" binding:"required"`
	PaymentMethod string `json:"payment_method" binding:"required"`
}

type PaymentResponse struct {
	Payment      *Payment `json:"payment"`
	ClientSecret string   `json:"client_secret,omitempty"`
}