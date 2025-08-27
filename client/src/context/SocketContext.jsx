// src/context/SocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // We only want to establish the connection once the user is authenticated.
    // Checking for a token is a good way to do this.
    const token = localStorage.getItem('token'); 

    if (token) {
      // Connect to your backend server.
      const newSocket = io('http://localhost:5001'); // Your backend URL
      setSocket(newSocket);

      // Clean up the connection when the component unmounts or the user logs out.
      return () => newSocket.close();
    }
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};