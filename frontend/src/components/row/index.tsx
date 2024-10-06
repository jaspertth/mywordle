import React from "react";
import { Square } from "../square";
import { RowProps } from "./interface";

export const Row: React.FC<RowProps> = ({ historyGuess, currentGuess }) => {
  if (!!currentGuess) {
    const currentGuessCharacters = currentGuess.split("");
    return (
      <div className="row current">
        {currentGuessCharacters.map((c, i) => (
          <Square key={i} inputCharacter={c} />
        ))}
        {Array.from({ length: 5 - currentGuessCharacters.length }).map(
          (_, i) => (
            <Square key={i} />
          )
        )}
      </div>
    );
  }
  return (
    <div className="row history">
      {Array.from({ length: 5 }).map((_, i) => (
        <Square key={i} characterWithValidation={historyGuess?.[i]} />
      ))}
    </div>
  );
};
