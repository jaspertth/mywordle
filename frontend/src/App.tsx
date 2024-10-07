import React, { useEffect, useState } from "react";
import { Wordle } from "./components/wordle";
import { Toast } from "./components/toast";
import { ToastProvider } from "./providers/toast-provider";
import { envConfig } from "./util";

function App() {
  const [isServerUp, setIsServerUp] = useState(false);

  const checkServerHealth = async () => {
    const response = await fetch(
      `${envConfig().serverUrl}/api/check-connection`,
      {
        method: "GET",
      }
    );
    return response.status;
  };

  useEffect(() => {
    checkServerHealth().then((result) => setIsServerUp(result === 200));
  }, []);

  return (
    <ToastProvider>
      {isServerUp && (
        <div className="App">
          <Wordle />
        </div>
      )}
    </ToastProvider>
  );
}

export default App;
