import React from "react";
import { Row } from "../row";
import { BoardProps } from "./interface";
import { envConfig } from "../../util";

export const Board: React.FC<BoardProps> = ({
  round,
  historyGuesses,
  currentGuess,
}) => {
  return (
    <div>
      {Array.from({ length: envConfig().maxRound }).map((_, i) => {
        if (i === round) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
        return <Row key={i} historyGuess={historyGuesses[i]} />;
      })}
    </div>
  );
};
