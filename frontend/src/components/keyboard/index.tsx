import React from "react";
import { alphabetArray } from "./const";
import { KeyboardProps } from "./interface";

export const Keyboard: React.FC<KeyboardProps> = ({
  usedAlphabets,
}) => {
  const handleClick = (alphabet: string) => {
    // Simulate the KeyboardEvent when a button is clicked
    const event = new KeyboardEvent("keyup", {
      key: alphabet,
      keyCode: alphabet.charCodeAt(0),
      code: `Key${alphabet}`,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="keyboard">
      {/* First Row */}
      <div className="keyboard-row">
        {alphabetArray.slice(0, 10).map((alphabet) => {
          const validateResult = usedAlphabets[alphabet];
          return (
            <button
              key={alphabet}
              className={`key ${validateResult}`}
              onClick={() => handleClick(alphabet)}
            >
              {alphabet}
            </button>
          );
        })}
      </div>

      {/* Second Row */}
      <div className="keyboard-row">
        {alphabetArray.slice(10, 19).map((alphabet) => {
          const validateResult = usedAlphabets[alphabet];
          return (
            <button
              key={alphabet}
              className={`key ${validateResult}`}
              onClick={() => handleClick(alphabet)}
            >
              {alphabet}
            </button>
          );
        })}
      </div>

      {/* Third Row */}
      <div className="keyboard-row">
        <button className="key enter" onClick={() => handleClick("Enter")}>
          Enter
        </button>
        {alphabetArray.slice(19).map((alphabet) => {
          const validateResult = usedAlphabets[alphabet];
          return (
            <button
              key={alphabet}
              className={`key ${validateResult}`}
              onClick={() => handleClick(alphabet)}
            >
              {alphabet}
            </button>
          );
        })}
        <button
          className="key backspace"
          onClick={() => handleClick("Backspace")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
