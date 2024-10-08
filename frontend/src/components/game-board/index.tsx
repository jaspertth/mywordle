import React from "react";
import { Row } from "../row";
import { GameBoardProps } from "./interface";
import { envConfig } from "../../util";

export const GameBoard: React.FC<GameBoardProps> = ({
  round,
  historyGuesses,
  currentGuess,
}) => {
  return (
    <div className="self">
      {Array.from({ length: envConfig().maxRound }).map((_, i) => {
        if (i === round) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
        return <Row key={i} historyGuess={historyGuesses[i]} />;
      })}
    </div>
  );
};
