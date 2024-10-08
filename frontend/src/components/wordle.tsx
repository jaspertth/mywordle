import React, { useContext, useEffect, useState } from "react";
import { useWordle } from "../hooks";
import { GameBoard } from "./game-board";
import { Keyboard } from "./keyboard";
import { Toast } from "./toast";
import { ToastContext } from "../providers/toast-provider";
import { envConfig } from "../util";
import { SocketContext } from "../providers/socket-provider";
import { OpponentBoard } from "./opponent-board";
import { CharacterWithValidation } from "../hooks/interface";

export const Wordle: React.FC = () => {
  const {
    round,
    isGameEnd,
    currentGuess,
    historyGuesses,
    usedAlphabets,
    handleKeyup,
  } = useWordle();

  const { updateContent } = useContext(ToastContext);
  const { socket } = useContext(SocketContext);
  const [isPlayerEnough, setIsPlayerEnough] = useState<boolean>(false);
  const [opponentHistoryGuesses, setOpponentHistoryGuesses] = useState<
    CharacterWithValidation[][]
  >([]);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    if (isGameEnd) {
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup, socket, updateContent]);

  useEffect(() => {
    if (round >= envConfig().maxRound) {
      updateContent("waiting for opponent to finish");
    }
  }, [round]);

  useEffect(() => {
    socket.on("isPlayerEnough", (isPlayerEnough: boolean) => {
      setIsPlayerEnough(isPlayerEnough);
      if (!isPlayerEnough) {
        updateContent("waiting for opponent to join");
      } else {
        updateContent("");
      }
    });
    return () => {
      socket.off("isPlayerEnough");
    };
  }, [socket, updateContent, setIsPlayerEnough]);

  useEffect(() => {
    socket.on(
      "opponentProgress",
      (opponentProgress: CharacterWithValidation[]) => {
        setOpponentHistoryGuesses((prev) => {
          return [...prev, opponentProgress];
        });
      }
    );

    return () => {
      socket.off("opponentProgress");
    };
  }, [socket]);

  return (
    <div>
      {!!socket && isPlayerEnough && (
        <>
          <GameBoard
            round={round}
            historyGuesses={historyGuesses}
            currentGuess={currentGuess}
          />
          <Keyboard usedAlphabets={usedAlphabets} handleKeyup={handleKeyup} />
          <OpponentBoard opponentHistoryGuesses={opponentHistoryGuesses} />
        </>
      )}
      <Toast />
    </div>
  );
};
