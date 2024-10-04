import React, { useEffect, useState } from "react";
import { Wordle } from "./components/wordle";

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

  return <div className="App">
     <div>Answer is : {answer}</div>
    {!!answer && <Wordle answer={answer} />}</div>;
}

export default App;
