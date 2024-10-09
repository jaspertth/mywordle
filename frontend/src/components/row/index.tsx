import React from "react";
import { Square } from "../square";
import { RowProps } from "./interface";
import { envConfig } from "../../util";

export const Row: React.FC<RowProps> = ({ historyGuess, currentGuess }) => {
  if (!!currentGuess) {
    const currentGuessCharacters = currentGuess.split("");
    return (
      <div className="row current">
        {currentGuessCharacters.map((c, i) => (
          <Square key={i} inputCharacter={c} />
        ))}
        {Array.from({
          length: envConfig().maxWordLength - currentGuessCharacters.length,
        }).map((_, i) => (
          <Square key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="row history">
      {Array.from({ length: envConfig().maxWordLength }).map((_, i) => (
        <Square key={i} index={i} characterWithValidation={historyGuess?.[i]} />
      ))}
    </div>
  );
};
