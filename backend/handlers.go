package main

import (
	"fmt"
	"log"

	// "net/http"
	// "sync"

	"github.com/gorilla/websocket"
)

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
