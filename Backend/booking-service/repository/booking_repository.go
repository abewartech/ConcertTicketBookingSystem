package repository

import (
	"booking-service/model"
	"database/sql"

	"github.com/sirupsen/logrus"
)

type BookingRepository struct {
	db *sql.DB
}

func NewBookingRepository(db *sql.DB) *BookingRepository {
	return &BookingRepository{db: db}
}

func (r *BookingRepository) GetConcerts() ([]*model.Concert, error) {
	query := `SELECT id, title, artist, venue, date, price, total_seats, available_seats, 
			  description, image_url, created_at, updated_at FROM concerts ORDER BY date ASC`
	
	rows, err := r.db.Query(query)
	if err != nil {
		logrus.Error("Failed to get concerts: ", err)
		return nil, err
	}
	defer rows.Close()

	var concerts []*model.Concert
	for rows.Next() {
		concert := &model.Concert{}
		err := rows.Scan(
			&concert.ID, &concert.Title, &concert.Artist, &concert.Venue,
			&concert.Date, &concert.Price, &concert.TotalSeats, &concert.AvailSeats,
			&concert.Description, &concert.ImageURL, &concert.CreatedAt, &concert.UpdatedAt,
		)
		if err != nil {
			logrus.Error("Failed to scan concert: ", err)
			continue
		}
		concerts = append(concerts, concert)
	}

	return concerts, nil
}

func (r *BookingRepository) GetConcertByID(id int) (*model.Concert, error) {
	concert := &model.Concert{}
	query := `SELECT id, title, artist, venue, date, price, total_seats, available_seats, 
			  description, image_url, created_at, updated_at FROM concerts WHERE id = ?`
	
	err := r.db.QueryRow(query, id).Scan(
		&concert.ID, &concert.Title, &concert.Artist, &concert.Venue,
		&concert.Date, &concert.Price, &concert.TotalSeats, &concert.AvailSeats,
		&concert.Description, &concert.ImageURL, &concert.CreatedAt, &concert.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		logrus.Error("Failed to get concert by ID: ", err)
		return nil, err
	}

	return concert, nil
}

func (r *BookingRepository) CreateBooking(booking *model.Booking) error {
	query := `INSERT INTO bookings (user_id, concert_id, quantity, total_price, status, created_at, updated_at) 
			  VALUES (?, ?, ?, ?, ?, NOW(), NOW())`
	
	result, err := r.db.Exec(query, booking.UserID, booking.ConcertID, booking.Quantity, booking.TotalPrice, booking.Status)
	if err != nil {
		logrus.Error("Failed to create booking: ", err)
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	booking.ID = int(id)
	return nil
}

func (r *BookingRepository) UpdateConcertSeats(concertID, quantity int) error {
	query := `UPDATE concerts SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?`
	
	result, err := r.db.Exec(query, quantity, concertID, quantity)
	if err != nil {
		logrus.Error("Failed to update concert seats: ", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows // Not enough seats available
	}

	return nil
}

func (r *BookingRepository) GetUserBookings(userID int) ([]*model.BookingResponse, error) {
	query := `SELECT b.id, b.user_id, b.concert_id, b.quantity, b.total_price, b.status, b.created_at, b.updated_at,
			  c.title, c.artist, c.venue, c.date, c.price, c.image_url
			  FROM bookings b 
			  JOIN concerts c ON b.concert_id = c.id 
			  WHERE b.user_id = ? ORDER BY b.created_at DESC`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		logrus.Error("Failed to get user bookings: ", err)
		return nil, err
	}
	defer rows.Close()

	var bookings []*model.BookingResponse
	for rows.Next() {
		booking := &model.Booking{}
		concert := &model.Concert{}
		
		err := rows.Scan(
			&booking.ID, &booking.UserID, &booking.ConcertID, &booking.Quantity,
			&booking.TotalPrice, &booking.Status, &booking.CreatedAt, &booking.UpdatedAt,
			&concert.Title, &concert.Artist, &concert.Venue, &concert.Date,
			&concert.Price, &concert.ImageURL,
		)
		if err != nil {
			logrus.Error("Failed to scan booking: ", err)
			continue
		}

		bookings = append(bookings, &model.BookingResponse{
			Booking: booking,
			Concert: concert,
		})
	}

	return bookings, nil
}