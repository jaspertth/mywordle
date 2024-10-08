import React, { useEffect, useState } from "react";
import { Wordle } from "./components/wordle";
import { Toast } from "./components/toast";
import { ToastProvider } from "./providers/toast-provider";
import { envConfig } from "./util";
import { io } from "socket.io-client";
import { SocketProvider } from "./providers/socket-provider";

function App() {
  return (
    <SocketProvider>
      <ToastProvider>
        <div className="App">
          <Wordle />
        </div>
      </ToastProvider>
    </SocketProvider>
  );
}

export default App;
