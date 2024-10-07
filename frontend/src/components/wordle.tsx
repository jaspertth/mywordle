import React, { useContext, useEffect, useState } from "react";
import { useWordle } from "../hooks/use-wordle";
import { Board } from "./board";
import { Keyboard } from "./keyboard";
import { Toast } from "./toast";
import { ToastContext } from "../providers/toast-provider";
import { envConfig } from "../util";

export const Wordle: React.FC = () => {
  const {
    round,
    isCorrect,
    currentGuess,
    historyGuesses,
    usedAlphabets,
    handleKeyup,
  } = useWordle();

  const { updateContent } = useContext(ToastContext);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    if (isCorrect || round >= envConfig().maxRound) {
      window.removeEventListener("keyup", handleKeyup);
    }
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {
    const checkGameStatus = async () => {
      if (isCorrect) {
        updateContent("Congrats!");
      } else if (round >= envConfig().maxRound) {
        const response = await fetch(
          `${envConfig().serverUrl}/api/get-answer`,
          {
            method: "GET",
          }
        );
        const { answer } = await response.json();
        updateContent(answer);
      }
    };

    checkGameStatus();
  }, [isCorrect, round, updateContent]);

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
