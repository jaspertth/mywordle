// src/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContextType } from "./interface";
import { envConfig } from "../../util";

export const SocketContext = createContext<SocketContextType>({
  socket: io(),
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket>(io());
  // const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(envConfig().serverUrl, {
      reconnection: false,
    });
    setSocket(socket);

    // Listen for connection and disconnection
    // socket.on("connect", () => {
    //   setIsConnected(true);
    //   console.log("Socket connected");
    // });

    // socket.on("disconnect", () => {
    //   setIsConnected(false);
    //   console.log("Socket disconnected");
    // });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
