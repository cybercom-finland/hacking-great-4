package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	// For routes
	"github.com/gorilla/mux"
	// sqlite
	_ "github.com/mattn/go-sqlite3"
)

// error response contains everything we need to use http.Error
type handlerError struct {
	Error   error
	Message string
	Code    int
}

type todo struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Id      int    `json:"id"`
}

// Database code
func initDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		panic(err)
	}
	if db == nil {
		panic("db nil")
	}
	return db
}

func createTable(db *sql.DB) {
	sql_table := `
	CREATE TABLE IF NOT EXISTS items(
		Id INTEGER NOT NULL PRIMARY KEY,
		Name TEXT,
		Content TEXT
	);
	`

	_, err := db.Exec(sql_table)
	if err != nil {
		panic(err)
	}
}

func storeItems(db *sql.DB, items []todo) {
	sql_additem := `
	INSERT OR REPLACE INTO items(
		Id,
		Name,
		Content
	) values(?, ?, ?)
	`

	stmt, err := db.Prepare(sql_additem)
	if err != nil {
		panic(err)
	}
	defer stmt.Close()

	for _, item := range items {
		_, err2 := stmt.Exec(item.Id, item.Title, item.Content)
		if err2 != nil {
			panic(err2)
		}
	}
}

func deleteItems(db *sql.DB, items []todo) {
	sql_delitem := `
	DELETE FROM items
	WHERE Id = ?
	`

	stmt, err := db.Prepare(sql_delitem)
	if err != nil {
		panic(err)
	}
	defer stmt.Close()

	for _, item := range items {
		_, err2 := stmt.Exec(item.Id)
		if err2 != nil {
			panic(err2)
		}
	}
}

func readItem(db *sql.DB, name string) todo {
	sql_read := `
	SELECT Id, Name, Content FROM items
	WHERE Name = ?
	`

	item := todo{}
	row := db.QueryRow(sql_read, name)
	err2 := row.Scan(&item.Id, &item.Title, &item.Content)
	if err2 != nil {
		panic(err2)
	}
	return item
}

func readItems(db *sql.DB) []todo {
	sql_readall := `
	SELECT Id, Name, Content FROM items
	`

	rows, err := db.Query(sql_readall)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	var result []todo
	for rows.Next() {
		item := todo{}
		err2 := rows.Scan(&item.Id, &item.Title, &item.Content)
		if err2 != nil {
			panic(err2)
		}
		result = append(result, item)
	}
	return result
}

// a custom type that we can use for handling errors and formatting responses
type handler func(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError)

// attach the standard ServeHTTP method to our handler so the http library can call it
func (fn handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// here we could do some prep work before calling the handler if we wanted to

	// call the actual handler
	response, err := fn(w, r)

	// check for errors
	if err != nil {
		log.Printf("ERROR: %v\n", err.Error)
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Message), err.Code)
		return
	}
	if response == nil {
		log.Printf("ERROR: response from method is nil\n")
		http.Error(w, "Internal server error. Check the logs.", http.StatusInternalServerError)
		return
	}

	// turn the response into JSON
	bytes, e := json.Marshal(response)
	if e != nil {
		http.Error(w, "Error marshalling JSON", http.StatusInternalServerError)
		return
	}

	// send the response and log
	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
	log.Printf("%s %s %s %d", r.RemoteAddr, r.Method, r.URL, 200)
}

func listTodos(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	return readItems(db), nil
}

func getTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	// mux.Vars grabs variables from the path
	param := mux.Vars(r)["id"]
	id, e := strconv.Atoi(param)
	if e != nil {
		return nil, &handlerError{e, "Id should be an integer", http.StatusBadRequest}
	}
	i := getTodoById(id)

	if i == (todo{}) {
		return nil, &handlerError{nil, "Could not find item " + param, http.StatusNotFound}
	}

	return i, nil
}

func parseTodoRequest(r *http.Request) (todo, *handlerError) {
	// the payload is in the request body
	data, e := ioutil.ReadAll(r.Body)
	if e != nil {
		return todo{}, &handlerError{e, "Could not read request", http.StatusBadRequest}
	}

	// turn the request body (JSON) into a todo object
	var payload todo
	e = json.Unmarshal(data, &payload)
	if e != nil {
		return todo{}, &handlerError{e, "Could not parse JSON", http.StatusBadRequest}
	}

	return payload, nil
}

func addTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	payload, e := parseTodoRequest(r)
	if e != nil {
		return nil, e
	}

	// it's our job to assign IDs, ignore what (if anything) the client sent
	payload.Id = getNextId()
	storeItems(db, []todo{payload})

	// we return the item we just made so the client can see the ID if they want
	return payload, nil
}

func updateTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	payload, e := parseTodoRequest(r)
	if e != nil {
		return nil, e
	}

	storeItems(db, []todo{payload})
	return make(map[string]string), nil
}

func removeTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	param := mux.Vars(r)["id"]
	id, e := strconv.Atoi(param)
	if e != nil {
		return nil, &handlerError{e, "Id should be an integer", http.StatusBadRequest}
	}
	// this is jsut to check to see if the item exists
	i := getTodoById(id)

	if i == (todo{}) {
		return nil, &handlerError{nil, "Could not find entry " + param, http.StatusNotFound}
	}

	deleteItems(db, []todo{i})
	return make(map[string]string), nil
}

func getTodoById(id int) todo {
	todos := readItems(db)
	for _, i := range todos {
		if i.Id == id {
			return i
		}
	}
	return todo{}
}

func getNextId() int {
	todos := readItems(db)
	greatest := 0
	for _, i := range todos {
		if i.Id > greatest {
			greatest = i.Id
		}
	}
	return greatest + 1
}

var db *sql.DB

func main() {
	// command line flags
	port := flag.Int("port", 8080, "port to serve on")
	dir := flag.String("directory", "static/", "directory of web files")
	dbpath := flag.String("dbpath", "db.sqlite", "sqlite database file")
	flag.Parse()

	// handle all requests by serving a file of the same name
	fs := http.Dir(*dir)
	fileHandler := http.FileServer(fs)

	router := mux.NewRouter()
	router.Handle("/", http.RedirectHandler("/static/", 302))
	router.Handle("/todos", handler(listTodos)).Methods("GET")
	router.Handle("/todos", handler(addTodo)).Methods("POST")
	router.Handle("/todos/{id}", handler(getTodo)).Methods("GET")
	router.Handle("/todos/{id}", handler(updateTodo)).Methods("POST")
	router.Handle("/todos/{id}", handler(removeTodo)).Methods("DELETE")
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static", fileHandler))
	http.Handle("/", router)

	// bootstrap db
	db = initDB(*dbpath)
	defer db.Close()
	createTable(db)

	items := []todo{
		todo{"Startup", "System started up", getNextId()},
	}
	storeItems(db, items)

	log.Printf("Running on port %d\n", *port)

	addr := fmt.Sprintf("127.0.0.1:%d", *port)
	// this call blocks -- the progam runs here forever
	err := http.ListenAndServe(addr, nil)
	fmt.Println(err.Error())
}
