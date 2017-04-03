all: mygotodo

gotmp:
	mkdir gotmp

mygotodo: main.go gotmp
	# TODO hax, get modules one by one as 'go get' would need proper gopath
	GOPATH="$(PWD)"/gotmp go get github.com/mattn/go-sqlite3
	GOPATH="$(PWD)"/gotmp go get github.com/gorilla/mux
	GOPATH="$(PWD)"/gotmp go build -v

clean:
	rm -f mygotodo
	rm -rf gotmp/
