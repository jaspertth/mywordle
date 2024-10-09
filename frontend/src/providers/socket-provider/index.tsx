import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { envConfig } from "../../util";
import { SocketContextType } from "./interface";

export const SocketContext = createContext<SocketContextType>({
  socket: {} as Socket,
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
