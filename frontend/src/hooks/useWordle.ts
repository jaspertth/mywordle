import React, { useState } from "react";
import { CharacterWithValidation } from "./interface";

export const useWordle = (answer: string) => {
  const [round, setRound] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [historyGuess, setHstoryGuess] = useState<string[]>([]);

  const checkWordExist = async (word: string) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const status = response.status;
    return status === 200;
  };

  const validateGuessByAnswer = () => {
    const validateCharacters = [...currentGuess].map<CharacterWithValidation>(
      (character) => ({ character, validateResult: "absent" })
    );

    // tracking a single character frequency in the word
    const characterFrequencies: { [key: string]: number } = {};

    // counting each character frequency
    for (let i = 0; i < answer.length; i++) {
      const char = answer[i];
      if (characterFrequencies[char]) {
        characterFrequencies[char]++;
      } else {
        characterFrequencies[char] = 1;
      }
    }

    // handle "correct"
    for (let i = 0; i < validateCharacters.length; i++) {
      const validateChar = validateCharacters[i];
      if (validateChar.character === answer[i]) {
        validateChar.validateResult = "correct";
        characterFrequencies[validateChar.character]--;
      }
    }

    // handle "present"
    for (let i = 0; i < validateCharacters.length; i++) {
      const validateChar = validateCharacters[i];
      if (
        validateChar.validateResult !== "correct" &&
        characterFrequencies[validateChar.character] > 0
      ) {
        validateChar.validateResult = "present";
        characterFrequencies[validateChar.character]--;
      }
    }

    return validateCharacters;
  };

  const handleKeyup = async (event: KeyboardEvent) => {
    const key = event.key;
    const isCurrentGuessMaxLength = currentGuess.length >= 5;

    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === "Enter") {
      const isWithinMaxRound = round < 6;
      if (!isWithinMaxRound) {
        console.log("You have used all chances");
        return;
      }

      if (!isCurrentGuessMaxLength) {
        console.log("Not enough letters");
        return;
      }

      const isWordExist = await checkWordExist(currentGuess);
      if (!isWordExist) {
        console.log("Word not exist");
        return;
      }

      const validated = validateGuessByAnswer();
      console.log(validated)
    } else {
      const isAlphabetKey = /^[A-Za-z]$/.test(key);

      if (isAlphabetKey && !isCurrentGuessMaxLength) {
        setCurrentGuess((prev) => prev + key);
        return;
      }
    }
  };

  return { round, isCorrect, currentGuess, historyGuess, handleKeyup };
};
