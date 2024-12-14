package main

import (
	"github.com/gorilla/websocket"
)

// Struct to represent a game
type Game struct {
	Host    *websocket.Conn   // Host connection
	Players []*websocket.Conn // List of player connections
}
