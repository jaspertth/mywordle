import React from "react";
import SquareProps from "./interface";

export const Square: React.FC<SquareProps> = ({
  index,
  characterWithValidation,
  inputCharacter,
}) => {
  if (!!inputCharacter) {
    return <div className="input">{inputCharacter}</div>;
  }

  return (
    <div
      style={
        {
          "--i": index,
          animationDelay: `calc(var(--i) * 0.3s)`,
        } as React.CSSProperties
      }
      className={characterWithValidation?.validateResult}
    >
      {characterWithValidation?.character}
    </div>
  );
};
