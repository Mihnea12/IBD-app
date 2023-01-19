package main

import (
	"encoding/json"
	"errors"
	"github.com/lib/pq"
	"net/http"
)

const (
	selectLocationsQuery = "SELECT * FROM locations"
	insertLocationQuery  = "INSERT INTO locations (location_id,name,longitude,latitude,type,rating) VALUES (:location_id, :name,:longitude,:latitude,:type,:rating)"
	userLocationsQuery   = "SELECT l.location_id, l.name, l.latitude, l.longitude, l.type, l.rating FROM visits v LEFT JOIN locations l ON v.location_id = l.location_id where v.user_id=? group by l.location_id, l.name, l.latitude, l.longitude, l.type, l.rating;"
)

type Location struct {
	LocationID string  `db:"location_id" json:"location_id"`
	Name       string  `db:"name" json:"name"`
	Longitude  float64 `db:"longitude" json:"longitude"`
	Latitude   float64 `db:"latitude" json:"latitude"`
	Type       string  `db:"type" json:"type"`
	Rating     float32 `db:"rating" json:"rating"`
}

func LocationsEntitiesGet(w http.ResponseWriter, r *http.Request) {
	var locations []Location

	//enableCors(&w)

	err := db.Select(&locations, selectLocationsQuery)
	if err != nil {
		return
	}

	// format data from database as json array
	output, err := json.Marshal(locations)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set response type, code and data and send response to client
	w.Header().Set("content-type", "application/json")
	_, err = w.Write(output)
}

func LocationsEntitiesPost(w http.ResponseWriter, r *http.Request) {
	var location Location

	//enableCors(&w)

	// get json data from request
	decoder := json.NewDecoder(r.Body)
	//decoder.DisallowUnknownFields()
	err := decoder.Decode(&location)

	// if there is any error while decoding (unknown json fields or wrong data types), return StatusBadRequest
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// if any of the fields are not filled or the id field is already completed, return StatusBadRequest
	if err := checkEmptyFieldsLocation(&location); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = db.NamedExec(insertLocationQuery, location)

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
		Id string `json:"location_id"`
	}{
		Id: location.LocationID,
	}
	js, err := json.Marshal(&s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func UserLocationsGet(w http.ResponseWriter, r *http.Request) {
	var user User
	var locations []Location

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

	err = db.Select(&locations, userLocationsQuery, user.UserID)

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

	js, err := json.Marshal(&locations)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func checkEmptyFieldsLocation(u *Location) error {
	if u.Name == "" {
		return errors.New("name field not filled in request")
	}
	if u.Type == "" {
		return errors.New("type field should not be filled in request")
	}
	return nil
}
