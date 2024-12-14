package main

import (
	"log"
	"net/http"

	// "sync"

	"github.com/gorilla/websocket"
)

// WebSocket upgrader to upgrade HTTP connections to WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins (CORS)
}

// Utility function to send a message to a client
func sendMessage(conn *websocket.Conn, action, message string) {
	response := map[string]string{
		"action":  action,
		"message": message,
	}
	if err := conn.WriteJSON(response); err != nil {
		log.Printf("Error sending message: %v", err)
	}
}
