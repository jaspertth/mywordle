import React, { useEffect } from "react";
import { useWordle } from "../hooks/use-wordle";
import { Board } from "./board";

interface WordleInputProps {
  answer: string;
}
export const Wordle: React.FC<WordleInputProps> = ({ answer }) => {
  const { round, currentGuess, historyGuesses, handleKeyup } = useWordle(answer);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  return (
    <div>
      <Board round={round} historyGuesses={historyGuesses} currentGuess={currentGuess} />
    </div>
  );
};
