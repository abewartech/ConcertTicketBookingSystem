package repository

import (
	"database/sql"
	"payment-service/model"

	"github.com/sirupsen/logrus"
)

type PaymentRepository struct {
	db *sql.DB
}

func NewPaymentRepository(db *sql.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(payment *model.Payment) error {
	query := `INSERT INTO payments (booking_id, user_id, amount, currency, status, payment_method, stripe_id, created_at, updated_at) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`
	
	result, err := r.db.Exec(query, payment.BookingID, payment.UserID, payment.Amount, 
		payment.Currency, payment.Status, payment.PaymentMethod, payment.StripeID)
	if err != nil {
		logrus.Error("Failed to create payment: ", err)
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	payment.ID = int(id)
	return nil
}

func (r *PaymentRepository) UpdateStatus(id int, status string) error {
	query := `UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?`
	
	_, err := r.db.Exec(query, status, id)
	if err != nil {
		logrus.Error("Failed to update payment status: ", err)
		return err
	}

	return nil
}

func (r *PaymentRepository) GetByID(id int) (*model.Payment, error) {
	payment := &model.Payment{}
	query := `SELECT id, booking_id, user_id, amount, currency, status, payment_method, stripe_id, created_at, updated_at 
			  FROM payments WHERE id = ?`
	
	err := r.db.QueryRow(query, id).Scan(
		&payment.ID, &payment.BookingID, &payment.UserID, &payment.Amount,
		&payment.Currency, &payment.Status, &payment.PaymentMethod, &payment.StripeID,
		&payment.CreatedAt, &payment.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		logrus.Error("Failed to get payment by ID: ", err)
		return nil, err
	}

	return payment, nil
}

func (r *PaymentRepository) GetByUserID(userID int) ([]*model.Payment, error) {
	query := `SELECT id, booking_id, user_id, amount, currency, status, payment_method, stripe_id, created_at, updated_at 
			  FROM payments WHERE user_id = ? ORDER BY created_at DESC`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		logrus.Error("Failed to get payments by user ID: ", err)
		return nil, err
	}
	defer rows.Close()

	var payments []*model.Payment
	for rows.Next() {
		payment := &model.Payment{}
		err := rows.Scan(
			&payment.ID, &payment.BookingID, &payment.UserID, &payment.Amount,
			&payment.Currency, &payment.Status, &payment.PaymentMethod, &payment.StripeID,
			&payment.CreatedAt, &payment.UpdatedAt,
		)
		if err != nil {
			logrus.Error("Failed to scan payment: ", err)
			continue
		}
		payments = append(payments, payment)
	}

	return payments, nil
}