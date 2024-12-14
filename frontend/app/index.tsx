import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const App = () => {
  // Connect to WebSocket server
  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('Connected to server');
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      console.log('Received message:', e.data);
      setMessages((prev) => [...prev, e.data]);
    };

    ws.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    ws.onclose = () => {
      console.log('Disconnected from server');
    };

    return () => ws.close();
  }, []);
  
  return (
    <Redirect href={'/(screens)/home'} />
  );
}

export default App

const styles = StyleSheet.create({})