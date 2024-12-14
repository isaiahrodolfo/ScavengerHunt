package main

import (
	"log"
	"net/http"
	"sync"
	// "github.com/gorilla/websocket"
)

// Map to store all games with their game codes
var games = make(map[string]*Game)
var mutex = sync.Mutex{} // To make the map thread-safe

func main() {
	// HTTP route for WebSocket connections
	http.HandleFunc("/ws", handleConnections)

	// Start the HTTP server
	port := "3000"
	log.Printf("Server running on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// Handle WebSocket connections
func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket Upgrade failed: %v", err)
		return
	}
	defer conn.Close() // Close the connection when the function exits

	// Message structure
	type Message struct {
		Action   string `json:"action"`
		GameCode string `json:"gameCode"`
	}

	// Continuously listen for messages from the client
	for {
		var msg Message
		if err := conn.ReadJSON(&msg); err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		// Handle different actions
		switch msg.Action {
		case "createGame":
			createGame(msg.GameCode, conn)
		case "joinGame":
			joinGame(msg.GameCode, conn)
		case "startGame":
			startGame(msg.GameCode, conn)
		case "closeGame":
			closeGame(msg.GameCode, conn)
		default:
			log.Printf("Unknown action: %s", msg.Action)
		}
	}
}
