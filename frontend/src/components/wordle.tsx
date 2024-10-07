import React, { useContext, useEffect, useState } from "react";
import { useWordle } from "../hooks/use-wordle";
import { Board } from "./board";
import { Keyboard } from "./keyboard";
import { Toast } from "./toast";
import { ToastContext } from "../providers/toast-provider";

interface WordleInputProps {
  answer: string;
}
export const Wordle: React.FC<WordleInputProps> = ({ answer }) => {
  const {
    round,
    isCorrect,
    currentGuess,
    historyGuesses,
    usedAlphabets,
    handleKeyup,
  } = useWordle(answer);

  const { updateContent } = useContext(ToastContext);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    if (isCorrect || round > 5) {
      window.removeEventListener("keyup", handleKeyup);
    }
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  if (isCorrect) {
    updateContent("congrats");
  } else if (round > 5) {
    updateContent(answer);
  }

  return (
    <div>
      <Board
        round={round}
        historyGuesses={historyGuesses}
        currentGuess={currentGuess}
      />
      <Keyboard usedAlphabets={usedAlphabets} handleKeyup={handleKeyup} />

      <Toast />
    </div>
  );
};
