package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket upgrader to upgrade HTTP connections to WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins (CORS)
}

// Struct to represent a game
type Game struct {
	Host    *websocket.Conn   // Host connection
	Players []*websocket.Conn // List of player connections
}

// Map to store all games with their game codes
var games = make(map[string]*Game)
var mutex = sync.Mutex{} // To make the map thread-safe

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

// Create a new game
func createGame(gameCode string, conn *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	if _, exists := games[gameCode]; exists {
		sendMessage(conn, "error", "Game code already exists")
		return
	}

	// Create a new game and add the host
	games[gameCode] = &Game{
		Host:    conn,
		Players: []*websocket.Conn{},
	}

	sendMessage(conn, "gameCreated", fmt.Sprintf("Game %s created successfully", gameCode))
	log.Printf("Game %s created by host", gameCode)
}

// Join an existing game
func joinGame(gameCode string, conn *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	game, exists := games[gameCode]
	if !exists {
		sendMessage(conn, "error", "Game code does not exist")
		return
	}

	// Add the player to the game's player list
	game.Players = append(game.Players, conn)
	sendMessage(conn, "gameJoined", fmt.Sprintf("Joined game %s", gameCode))
	sendMessage(game.Host, "playerJoined", "A new player has joined the game")

	log.Printf("Player joined game %s", gameCode)
}

// Start the game (only the host can do this)
func startGame(gameCode string, conn *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	game, exists := games[gameCode]
	if !exists || game.Host != conn {
		sendMessage(conn, "error", "Only the host can start the game")
		return
	}

	// Notify all players
	sendMessage(game.Host, "gameStarted", "Game has started")
	for _, player := range game.Players {
		sendMessage(player, "gameStarted", "Game has started")
	}

	log.Printf("Game %s started", gameCode)
}

// Close a game (only the host can do this)
func closeGame(gameCode string, conn *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	game, exists := games[gameCode]
	if !exists || game.Host != conn {
		sendMessage(conn, "error", "Only the host can close the game")
		return
	}

	// Notify all players
	for _, player := range game.Players {
		sendMessage(player, "gameClosed", "The game has been closed")
		player.Close()
	}

	// Remove the game from the map
	delete(games, gameCode)
	sendMessage(conn, "gameClosed", "Game has been closed")
	log.Printf("Game %s closed", gameCode)
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
