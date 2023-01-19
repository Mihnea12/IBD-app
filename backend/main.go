package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/rs/cors"
)

var schema = `
if not exists (select * from sysobjects where name='users' and xtype='U')
	CREATE TABLE users (
		user_id    varchar(36) NOT NULL,
		first_name varchar(80),
		last_name  varchar(80),
		email      varchar(250),
		password   varchar(250),
		username   varchar(40),
		age        int,
		occupation varchar(100),
		CONSTRAINT PK_User PRIMARY KEY (user_id)
	);

if not exists (select * from sysobjects where name='locations' and xtype='U')
	CREATE TABLE locations (
		location_id varchar(36) NOT NULL,
		name varchar(50),
		longitude double precision,
		latitude double precision,
		type varchar(15),
		rating float
		CONSTRAINT PK_Location PRIMARY KEY (location_id)                 
	);

if not exists (select * from sysobjects where name='visits' and xtype='U')
	CREATE TABLE visits (
		visit_id varchar(36) NOT NULL,
		location_id varchar(36) NOT NULL,
		user_id varchar(36) NOT NULL,
		date_time datetime,
		comment varchar(500),
		rating float,
		spending float,
		CONSTRAINT PK_Visit PRIMARY KEY (visit_id, location_id),
		CONSTRAINT FK_Visit_User FOREIGN KEY (user_id) REFERENCES users(user_id),
		CONSTRAINT FK_Visit_Location FOREIGN KEY (location_id) REFERENCES locations(location_id)
	);
`

var trigger = `
CREATE OR ALTER TRIGGER Final_rating_compute
ON master.dbo.visits
AFTER  INSERT AS UPDATE locations 
SET rating = average FROM 
	(SELECT l.location_id, AVG(v.rating) AS average
	FROM locations l
	JOIN visits v ON v.location_id = l.location_id
	GROUP BY l.location_id, l.name
	) Temp
WHERE temp.location_id = locations.location_id
and locations.location_id IN (
SELECT location_id FROM inserted);
`

var db *sqlx.DB

func main() {
	var err error
	// this connects & tries a simple 'SELECT 1', panics on error
	// use sqlx.Open() for sql.Open() semantics
	db, err = sqlx.Connect(
		"mssql",
		"sqlserver://SA:Password1!@mssql:1433?database=master&connection+timeout=30",
	)
	if err != nil {
		log.Fatalln(err)
	}

	//exec the schema or fail;
	db.MustExec(schema)
	db.MustExec(trigger)

	// Query the database, storing results in a []User (wrapped in []interface{})
	var people []User
	db.Select(&people, "SELECT * FROM users ORDER BY first_name ASC")

	fmt.Println(people)

	registerRoutes()
}

func registerRoutes() {
	router := mux.NewRouter()
	router.HandleFunc("/", HealthGet).Methods("GET")

	router.HandleFunc("/login", LoginPost).Methods("POST")
	router.HandleFunc("/entities/users", UsersEntitiesGet).Methods("GET")
	router.HandleFunc("/entities/users", UsersEntitiesPost).Methods("POST")

	router.HandleFunc("/entities/locations", LocationsEntitiesGet).Methods("GET")
	router.HandleFunc("/entities/locations", LocationsEntitiesPost).Methods("POST")
	router.HandleFunc("/entities/user/locations", UserLocationsGet).Methods("GET")

	router.HandleFunc("/entities/visits", VisitsEntitiesGet).Methods("GET")
	router.HandleFunc("/entities/user/visits", VisitsUserEntitiesGet).Methods("GET")
	router.HandleFunc("/entities/user/visits", VisitsEntitiesPost).Methods("POST")

	router.HandleFunc("/stats/visits/count", StatsVisitsGet).Methods("GET")
	router.HandleFunc("/stats/visits/ratings", StatsVisitRatingsGet).Methods("GET")
	router.HandleFunc("/stats/visits/timestamps", StatsVisitTimestampsPost).Methods("POST")
	router.HandleFunc("/stats/visits/spending", StatsVisitSpendingsGet).Methods("GET")

	fmt.Println("Successfully connected here!")
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":8081", handler))

}

//func enableCors(w *http.ResponseWriter) {
//	(*w).Header().Set("Content-Type", "text/html; charset=ascii")
//	(*w).Header().Set("Access-Control-Allow-Origin", "*")
//	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
//
//}

type Health struct {
	Text string `json:"text"`
}

func HealthGet(w http.ResponseWriter, _ *http.Request) {
	var health Health
	health.Text = "alive and well"
	//enableCors(&w)

	output, err := json.Marshal(health)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set response type, code and data and send response to client
	w.Header().Set("content-type", "application/json")
	_, err = w.Write(output)
}
