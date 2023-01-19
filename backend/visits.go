package main

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"net/http"
	"time"
)

const (
	selectVisitsQuery          = "SELECT * FROM visits"
	selectUserVisitsQuery      = "SELECT * FROM visits WHERE user_id = ?"
	insertVisitQuery           = "INSERT INTO visits (visit_id,location_id,user_id,date_time,comment,rating,spending) VALUES (:visit_id,:location_id,:user_id,:date_time,:comment,:rating,:spending)"
	statsLocationQuery         = "SELECT l.name, count(*) as visits FROM visits v LEFT JOIN locations l ON v.location_id = l.location_id GROUP BY l.name;"
	statsVisitsSpendingQuery   = "SELECT l.name, AVG(v.spending) as spending FROM visits v LEFT JOIN locations l ON v.location_id = l.location_id GROUP BY l.name;"
	statsVisitsRatingQuery     = "SELECT l.name, AVG(v.rating) as avg_rating FROM visits v LEFT JOIN locations l ON v.location_id = l.location_id GROUP BY l.name;"
	statsVisitsTimestampsQuery = "SELECT v.date_time FROM visits v LEFT JOIN locations l ON v.location_id = l.location_id WHERE l.location_id = ? GROUP BY l.name, v.date_time;"
)

type Visit struct {
	VisitID    string    `db:"visit_id" json:"visit_id"`
	LocationID string    `db:"location_id" json:"location_id"`
	UserID     string    `db:"user_id" json:"user_id"`
	Date       time.Time `db:"date_time" json:"date_time"`
	Comment    string    `db:"comment" json:"comment"`
	Rating     float32   `db:"rating" json:"rating"`
	Spending   float32   `db:"spending" json:"spending"`
}

type LocationStats struct {
	Visits   int    `db:"visits" json:"visits"`
	Location string `db:"name" json:"location"`
}

type SpendingStats struct {
	Spending float32 `db:"spending" json:"spending"`
	Location string  `db:"name" json:"location"`
}

type VisitRatings struct {
	AvgRating float32 `db:"avg_rating" json:"avg_rating"`
	Location  string  `db:"name" json:"location"`
}

func VisitsEntitiesGet(w http.ResponseWriter, _ *http.Request) {
	var visits []Visit

	//enableCors(&w)

	err := db.Select(&visits, selectVisitsQuery)
	if err != nil {
		return
	}

	// format data from database as json array
	output, err := json.Marshal(visits)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set response type, code and data and send response to client
	w.Header().Set("content-type", "application/json")
	_, err = w.Write(output)
}

func VisitsUserEntitiesGet(w http.ResponseWriter, r *http.Request) {
	var user User
	var visits []Visit

	//enableCors(&w)

	// get json data from request
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&user)

	// if there is any error while decoding (unknown json fields or wrong data types), return StatusBadRequest
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = db.Select(&visits, selectUserVisitsQuery, user.UserID)

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

	js, err := json.Marshal(&visits)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func VisitsEntitiesPost(w http.ResponseWriter, r *http.Request) {
	var visit Visit

	//enableCors(&w)

	// get json data from request
	decoder := json.NewDecoder(r.Body)
	//decoder.DisallowUnknownFields()
	err := decoder.Decode(&visit)

	// if there is any error while decoding (unknown json fields or wrong data types), return StatusBadRequest
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	visit.VisitID = uuid.New().String()

	_, err = db.NamedExec(insertVisitQuery, visit)

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
		Id string `json:"visit_id"`
	}{
		Id: visit.VisitID,
	}
	js, err := json.Marshal(&s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func StatsVisitsGet(w http.ResponseWriter, _ *http.Request) {
	var stats []LocationStats

	//enableCors(&w)

	err := db.Select(&stats, statsLocationQuery)

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

	js, err := json.Marshal(&stats)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func StatsVisitRatingsGet(w http.ResponseWriter, _ *http.Request) {
	var stats []VisitRatings

	//enableCors(&w)

	err := db.Select(&stats, statsVisitsRatingQuery)

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

	js, err := json.Marshal(&stats)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func StatsVisitTimestampsPost(w http.ResponseWriter, r *http.Request) {
	var stats []time.Time
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

	err = db.Select(&stats, statsVisitsTimestampsQuery, location.LocationID)

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

	js, err := json.Marshal(&stats)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}

func StatsVisitSpendingsGet(w http.ResponseWriter, _ *http.Request) {
	var stats []SpendingStats

	//enableCors(&w)

	err := db.Select(&stats, statsVisitsSpendingQuery)

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

	js, err := json.Marshal(&stats)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(js)
}
