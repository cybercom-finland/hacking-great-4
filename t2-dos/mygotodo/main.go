package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	// For routes
	"github.com/gorilla/mux"
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

var todos = make([]todo, 0)

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
	return todos, nil
}

func getTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	// mux.Vars grabs variables from the path
	param := mux.Vars(r)["id"]
	id, e := strconv.Atoi(param)
	if e != nil {
		return nil, &handlerError{e, "Id should be an integer", http.StatusBadRequest}
	}
	b, index := getTodoById(id)

	if index < 0 {
		return nil, &handlerError{nil, "Could not find item " + param, http.StatusNotFound}
	}

	return b, nil
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
	todos = append(todos, payload)

	// we return the item we just made so the client can see the ID if they want
	return payload, nil
}

func updateTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	payload, e := parseTodoRequest(r)
	if e != nil {
		return nil, e
	}

	_, index := getTodoById(payload.Id)
	todos[index] = payload
	return make(map[string]string), nil
}

func removeTodo(w http.ResponseWriter, r *http.Request) (interface{}, *handlerError) {
	param := mux.Vars(r)["id"]
	id, e := strconv.Atoi(param)
	if e != nil {
		return nil, &handlerError{e, "Id should be an integer", http.StatusBadRequest}
	}
	// this is jsut to check to see if the item exists
	_, index := getTodoById(id)

	if index < 0 {
		return nil, &handlerError{nil, "Could not find entry " + param, http.StatusNotFound}
	}

	todos = append(todos[:index], todos[index+1:]...)
	return make(map[string]string), nil
}

// searches the todos for the item with `id` and returns the item and it's index, or -1 for 404
func getTodoById(id int) (todo, int) {
	for i, b := range todos {
		if b.Id == id {
			return b, i
		}
	}
	return todo{}, -1
}

var id = 0

// increments id and returns the value
func getNextId() int {
	id += 1
	return id
}

func main() {
	// command line flags
	port := flag.Int("port", 8080, "port to serve on")
	dir := flag.String("directory", "static/", "directory of web files")
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

	// bootstrap some data
	todos = append(todos, todo{"Ender's Game", "Orson Scott Card", getNextId()})
	todos = append(todos, todo{"Code Complete", "Steve McConnell", getNextId()})
	todos = append(todos, todo{"World War Z", "Max Brooks", getNextId()})
	todos = append(todos, todo{"Pragmatic Programmer", "David Thomas", getNextId()})

	log.Printf("Running on port %d\n", *port)

	addr := fmt.Sprintf("127.0.0.1:%d", *port)
	// this call blocks -- the progam runs here forever
	err := http.ListenAndServe(addr, nil)
	fmt.Println(err.Error())
}
