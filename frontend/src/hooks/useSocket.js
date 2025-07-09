import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔌 Attempting to connect to server...');
    
    const newSocket = io('http://localhost:4001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    newSocket.on('connect', () => {
      console.log('✅ Connected to server successfully');
      setConnected(true);
      setError(null);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setError(error.message);
      setConnected(false);
    });

    newSocket.on('aiStatus', (status) => {
      console.log('📊 Received AI status:', status);
    });

    newSocket.on('stockAlert', (alerts) => {
      console.log('🚨 Received stock alerts:', alerts);
    });
    
    setSocket(newSocket);
    
    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  return { socket, connected, error };
};