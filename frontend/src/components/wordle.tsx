import React, { useEffect } from "react";
import { useWordle } from "../hooks/useWordle";

interface WordleInputProps {
  answer: string;
}
export const Wordle: React.FC<WordleInputProps> = ({ answer }) => {
  const { currentGuess, handleKeyup } = useWordle(answer);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);
  return <>{currentGuess}</>;
};
