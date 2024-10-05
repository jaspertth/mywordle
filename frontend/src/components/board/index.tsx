import React from "react";
import { Row } from "../row";
import { BoardProps } from "./interface";

export const Board: React.FC<BoardProps> = ({round, historyGuesses, currentGuess}) => {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => {
        if (i === round) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
      return <Row key={i} historyGuess={historyGuesses[i]}/>
})}
    </div>
  );
};
