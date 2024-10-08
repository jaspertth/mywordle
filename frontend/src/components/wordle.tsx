import React, { useContext, useEffect, useState } from "react";
import { useWordle } from "../hooks/use-wordle";
import { Board } from "./board";
import { Keyboard } from "./keyboard";
import { Toast } from "./toast";
import { ToastContext } from "../providers/toast-provider";
import { envConfig } from "../util";
import { SocketContext } from "../providers/socket-provider";

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
  const { socket } = useContext(SocketContext);
  const [isPlayerEnough, setIsPlayerEnough] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    if (isCorrect || round >= envConfig().maxRound) {
      window.removeEventListener("keyup", handleKeyup);
    }
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {
    if (isCorrect) {
      updateContent("congrats!");
    } else if (round >= envConfig().maxRound) {
      updateContent("waiting for opponent to finish");
    }
  }, [isCorrect, round]);

  useEffect(() => {
    socket.once("draw", (result) => {
      updateContent(`Draw. Answer is ${result}`);
    });
  }, [updateContent]);

  useEffect(() => {
    socket.on("isPlayerEnough", (isPlayerEnough: boolean) => {
      setIsPlayerEnough(isPlayerEnough);
      if (!isPlayerEnough) {
        updateContent("waiting for opponent to join");
      } else {
        updateContent("");
      }
    });
  }, [socket, updateContent, setIsPlayerEnough]);

  useEffect(() => {
    socket.on("opponentProgress", (opponentProgress) => {
      console.log(opponentProgress);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      {!!socket && isPlayerEnough && (
        <>
          <Board
            round={round}
            historyGuesses={historyGuesses}
            currentGuess={currentGuess}
          />
          <Keyboard usedAlphabets={usedAlphabets} handleKeyup={handleKeyup} />
        </>
      )}
      <Toast />
    </div>
  );
};
