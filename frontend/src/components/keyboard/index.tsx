import React from "react";
import { alphabetArray } from "./const";
import { UsedAlphabets } from "../../hooks/interface";
import { KeyboardProps } from "./interface";

export const Keyboard: React.FC<KeyboardProps> = ({ usedAlphabets }) => {
  return (
    <div className="keyboard">
      {alphabetArray.map((alphabet) => {
        const validateResult = usedAlphabets[alphabet];
        return (
          <button key={alphabet} className={`${validateResult}`}>
            {alphabet}
          </button>
        );
      })}
    </div>
  );
};
