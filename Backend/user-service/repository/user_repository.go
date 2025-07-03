package repository

import (
	"database/sql"
	"user-service/model"

	"github.com/sirupsen/logrus"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *model.User) error {
	query := `INSERT INTO users (email, password, first_name, last_name, phone, created_at, updated_at) 
			  VALUES (?, ?, ?, ?, ?, NOW(), NOW())`
	
	result, err := r.db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName, user.Phone)
	if err != nil {
		logrus.Error("Failed to create user: ", err)
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = int(id)
	return nil
}

func (r *UserRepository) GetByEmail(email string) (*model.User, error) {
	user := &model.User{}
	query := `SELECT id, email, password, first_name, last_name, phone, created_at, updated_at 
			  FROM users WHERE email = ?`
	
	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.Email, &user.Password, &user.FirstName, 
		&user.LastName, &user.Phone, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		logrus.Error("Failed to get user by email: ", err)
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByID(id int) (*model.User, error) {
	user := &model.User{}
	query := `SELECT id, email, password, first_name, last_name, phone, created_at, updated_at 
			  FROM users WHERE id = ?`
	
	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.Email, &user.Password, &user.FirstName, 
		&user.LastName, &user.Phone, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		logrus.Error("Failed to get user by ID: ", err)
		return nil, err
	}

	return user, nil
}