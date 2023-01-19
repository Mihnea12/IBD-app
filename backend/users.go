package main

import (
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"net/http"
)

const (
	selectUsersQuery = "SELECT * FROM users ORDER BY first_name ASC"
	selectUserQuery  = "SELECT * FROM users WHERE username = ? AND password = ?"
	insertUserQuery  = "INSERT INTO users (user_id,first_name,last_name,email,password,username,age,occupation) VALUES (:user_id, :first_name,:last_name,:email,:password,:username,:age,:occupation)"
)

// User holds information about a user
type User struct {
	UserID     string `db:"user_id" json:"user_id"`
	FirstName  string `db:"first_name" json:"first_name"`
	LastName   string `db:"last_name" json:"last_name"`
	Email      string `db:"email" json:"email"`
	Password   string `db:"password" json:"password"`
	Username   string `db:"username" json:"username"`
	Age        int    `db:"age" json:"age"`
	Occupation string `db:"occupation" json:"occupation"`
}

// LoginUser holds information about a user
type LoginUser struct {
	Username string `db:"username" json:"username"`
	Password string `db:"password" json:"password"`
}

func UsersEntitiesGet(w http.ResponseWriter, _ *http.Request) {
	var users []User

	//enableCors(&w)

	err := db.Select(&users, selectUsersQuery)
	if err != nil {
		return
	}

	// format data from database as json array
	output, err := json.Marshal(users)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set response type, code and data and send response to client
	w.Header().Set("content-type", "application/json")
	_, err = w.Write(output)
}

func LoginPost(w http.ResponseWriter, r *http.Request) {
	var loginUser LoginUser
	var user User

	//enableCors(&w)

	// get json data from request
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginUser)

	// if there is any error while decoding (unknown json fields or wrong data types), return StatusBadRequest
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//err = db.Select(&user, selectUserQuery, loginUser.Username, loginUser.Password)
	err = db.QueryRow(selectUserQuery, loginUser.Username, loginUser.Password).
		Scan(&user.UserID, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Username, &user.Age, &user.Occupation)

	// treat database errors
	if err != nil {
		if err, ok := err.(*pq.Error); ok {
			if err.Code.Name() == "unique_violation" {
				http.Error(w, err.Error(), http.StatusConflict)
				return
			}
			if err.Code.Name() == "foreign_key_violation" {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
		}
		if err.Error() == "sql: no rows in result set" {
			http.Error(w, "", http.StatusForbidden)
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// build json and send response to client
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(http.StatusOK)

	js, err := json.Marshal(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func UsersEntitiesPost(w http.ResponseWriter, r *http.Request) {
	var user User

	//enableCors(&w)

	// get json data from request
	decoder := json.NewDecoder(r.Body)
	//decoder.DisallowUnknownFields()
	err := decoder.Decode(&user)

	// if there is any error while decoding (unknown json fields or wrong data types), return StatusBadRequest
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// if any of the fields are not filled or the id field is already completed, return StatusBadRequest
	if err := checkEmptyFieldsUser(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user.UserID = uuid.New().String()

	_, err = db.NamedExec(insertUserQuery, user)

	// treat database errors
	if err != nil {
		if err, ok := err.(*pq.Error); ok {
			if err.Code.Name() == "unique_violation" {
				http.Error(w, err.Error(), http.StatusConflict)
				return
			}
			if err.Code.Name() == "foreign_key_violation" {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// build json and send response to client
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(http.StatusCreated)
	s := struct {
		Id string `json:"user_id"`
	}{
		Id: user.UserID,
	}
	js, err := json.Marshal(&s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func checkEmptyFieldsUser(u *User) error {
	if u.FirstName == "" {
		return errors.New("firstName field not filled in request")
	}
	if u.LastName == "" {
		return errors.New("lastName field not filled in request")
	}
	if u.Password == "" {
		return errors.New("password field not filled in request")
	}
	if u.Email == "" {
		return errors.New("email field should not be filled in request")
	}
	return nil
}
