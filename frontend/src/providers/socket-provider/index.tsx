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

  useEffect(() => {
    const socket = io(envConfig().serverUrl, {
      reconnection: false,
    });
    setSocket(socket);

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
