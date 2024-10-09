import React, { useContext, useEffect, useRef, useState } from "react";
import { useWordle } from "../hooks";
import { GameBoard } from "./game-board";
import { Keyboard } from "./keyboard";
import { Toast } from "./toast";
import { ToastContext } from "../providers/toast-provider";
import { envConfig } from "../util";
import { SocketContext } from "../providers/socket-provider";
import { OpponentBoard } from "./opponent-board";
import { CharacterWithValidation, WinningEvent } from "../hooks/interface";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

export const Wordle: React.FC = () => {
  const { updateContent } = useContext(ToastContext);
  const { socket } = useContext(SocketContext);

  const { round, currentGuess, historyGuesses, usedAlphabets, handleKeyup } =
    useWordle(socket);

  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [isPlayerEnough, setIsPlayerEnough] = useState<boolean>(false);
  const [gameRoomId, setGameRoomId] = useState<string>("");
  const [opponentHistoryGuesses, setOpponentHistoryGuesses] = useState<
    CharacterWithValidation[][]
  >([]);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    socket.once("winning", ({ type, message }: WinningEvent) => {
      if (type === "draw") {
        updateContent(message);
      } else {
        updateContent(message === socket.id ? "you won" : "you lost");
      }

      setIsGameEnd(true);
    });

    socket.once("opponentDisconnected", (message: string) => {
      setIsGameEnd(true);
      updateContent(message);
    });

    if (isGameEnd) {
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup, socket]);

  useEffect(() => {
    socket.on("isPlayerEnough", (isPlayerEnough: boolean) => {
      setIsPlayerEnough(isPlayerEnough);
    });

    socket.on(
      "opponentProgress",
      (opponentProgress: CharacterWithValidation[]) => {
        setOpponentHistoryGuesses((prev) => {
          return [...prev, opponentProgress];
        });
      }
    );

    socket.on("wordExistence", (message: string) => {
      updateContent(message, 1500);
    });

    socket.once("gameRoomId", (gameRoomId: string) => {
      setGameRoomId(gameRoomId);
    });

    return () => {
      socket.off("opponentProgress");
      socket.off("isPlayerEnough");
    };
  }, [socket, updateContent, setIsPlayerEnough]);

  useEffect(() => {
    if (!isPlayerEnough) {
      updateContent("waiting for opponent to join");
    } else if (round >= envConfig().maxRound) {
      updateContent("waiting for opponent to finish");
    } else {
      updateContent("");
    }
  }, [isPlayerEnough, round]);

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "inherit",
          color: "black",
          height: "80px",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Typography fontWeight="bold" fontSize="25px">
          Wordle
        </Typography>
        <Typography fontSize="10px">Room ID: {gameRoomId}</Typography>
      </AppBar>
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
