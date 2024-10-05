import React from "react";
import SquareProps from "./interface";

export const Square: React.FC<SquareProps> = ({
  characterWithValidation,
  inputCharacter,
}) => {
  if (!!inputCharacter) {
    return <div className="input">{inputCharacter}</div>;
  }

  return (
    <div className={characterWithValidation?.validateResult}>
      {characterWithValidation?.character}
    </div>
  );
};
