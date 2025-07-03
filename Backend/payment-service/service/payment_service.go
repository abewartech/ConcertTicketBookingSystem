package service

import (
	"payment-service/model"
	"payment-service/repository"

	"github.com/sirupsen/logrus"
	"github.com/stripe/stripe-go/v75"
	"github.com/stripe/stripe-go/v75/paymentintent"
)

type PaymentService struct {
	repo      *repository.PaymentRepository
	stripeKey string
}

func NewPaymentService(repo *repository.PaymentRepository, stripeKey string) *PaymentService {
	stripe.Key = stripeKey
	return &PaymentService{
		repo:      repo,
		stripeKey: stripeKey,
	}
}

func (s *PaymentService) CreatePayment(userID int, req *model.PaymentRequest) (*model.PaymentResponse, error) {
	// Create Stripe PaymentIntent
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(req.Amount * 100)), // Convert to cents
		Currency: stripe.String(req.Currency),
		Metadata: map[string]string{
			"booking_id": string(rune(req.BookingID)),
			"user_id":    string(rune(userID)),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		logrus.Error("Failed to create Stripe PaymentIntent: ", err)
		return nil, err
	}

	// Create payment record
	payment := &model.Payment{
		BookingID:     req.BookingID,
		UserID:        userID,
		Amount:        req.Amount,
		Currency:      req.Currency,
		Status:        "pending",
		PaymentMethod: req.PaymentMethod,
		StripeID:      pi.ID,
	}

	err = s.repo.Create(payment)
	if err != nil {
		return nil, err
	}

	return &model.PaymentResponse{
		Payment:      payment,
		ClientSecret: pi.ClientSecret,
	}, nil
}

func (s *PaymentService) UpdatePaymentStatus(paymentID int, status string) error {
	return s.repo.UpdateStatus(paymentID, status)
}

func (s *PaymentService) GetPaymentByID(id int) (*model.Payment, error) {
	return s.repo.GetByID(id)
}

func (s *PaymentService) GetUserPayments(userID int) ([]*model.Payment, error) {
	return s.repo.GetByUserID(userID)
}

func (s *PaymentService) ProcessWebhook(eventType string, paymentIntentID string) error {
	// Handle Stripe webhook events
	switch eventType {
	case "payment_intent.succeeded":
		// Update payment status to completed
		// This would require finding the payment by stripe_id first
		logrus.Info("Payment succeeded: ", paymentIntentID)
	case "payment_intent.payment_failed":
		// Update payment status to failed
		logrus.Info("Payment failed: ", paymentIntentID)
	}

	return nil
}