import React, { useEffect, useState } from "react";
import { Wordle } from "./components/wordle";
import { Toast } from "./components/toast";
import { ToastProvider } from "./providers/toast-provider";

function App() {
  const [answer, setAnswer] = useState(null);

  const fetchWord = async () => {
    const response = await fetch(
      "https://random-word-api.herokuapp.com/word?length=5"
    );
    return await response.json();
  };

  useEffect(() => {
    fetchWord().then((result) => setAnswer(result[0]));
  }, []);

  return (
    <ToastProvider>
      <div className="App">
        <div>{answer}</div>
        {!!answer && <Wordle answer={answer} />}
      </div>
    </ToastProvider>
  );
}

export default App;
