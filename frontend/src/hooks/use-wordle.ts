import React, { useContext, useState } from "react";
import { CharacterWithValidation, UsedAlphabets } from "./interface";
import { ValidateResult } from "./const";
import { ToastContext } from "../providers/toast-provider";

export const useWordle = (answer: string) => {
  const [round, setRound] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [historyGuesses, setHstoryGuesses] = useState<
    CharacterWithValidation[][]
  >([...Array(answer.length)]);
  const [usedAlphabets, setUsedAlphabets] = useState<UsedAlphabets>({});

  const { updateContent } = useContext(ToastContext);

  const checkWordExist = async (word: string) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const status = response.status;
    return status === 200;
  };

  const validateGuessByAnswer = (): CharacterWithValidation[] => {
    const validatedCharacters = [...currentGuess].map<CharacterWithValidation>(
      (character) => ({ character, validateResult: ValidateResult.Absent })
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
    for (let i = 0; i < validatedCharacters.length; i++) {
      const validatedChar = validatedCharacters[i];
      if (validatedChar.character === answer[i]) {
        validatedChar.validateResult = ValidateResult.Correct;
        characterFrequencies[validatedChar.character]--;
      }
    }

    // handle "present"
    for (let i = 0; i < validatedCharacters.length; i++) {
      const validatedChar = validatedCharacters[i];
      if (
        validatedChar.validateResult !== ValidateResult.Correct &&
        characterFrequencies[validatedChar.character] > 0
      ) {
        validatedChar.validateResult = ValidateResult.Present;
        characterFrequencies[validatedChar.character]--;
      }
    }

    setUsedAlphabets((prev) => {
      const newUsedAlphabets = prev;
      validatedCharacters.forEach((validatedChar) => {
        const prevValidatedResult = newUsedAlphabets[validatedChar.character];
        switch (validatedChar.validateResult) {
          case ValidateResult.Correct:
            newUsedAlphabets[validatedChar.character] = ValidateResult.Correct;
            break;
          case ValidateResult.Present:
            if (prevValidatedResult !== ValidateResult.Correct) {
              newUsedAlphabets[validatedChar.character] =
                ValidateResult.Present;
            }
            break;
          case ValidateResult.Absent:
            if (
              prevValidatedResult !== ValidateResult.Correct &&
              prevValidatedResult !== ValidateResult.Present
            ) {
              newUsedAlphabets[validatedChar.character] = ValidateResult.Absent;
            }
            break;
        }
      });
      return newUsedAlphabets;
    });

    if (currentGuess === answer) {
      setIsCorrect(true);
    }

    setRound((prev) => prev + 1);

    return validatedCharacters;
  };

  const addValidatedGuessToHistoryGuess = (
    validatedGuess: CharacterWithValidation[]
  ) => {
    setHstoryGuesses((prev) => {
      let newGuess = [...prev];
      newGuess[round] = validatedGuess;
      return newGuess;
    });
    setCurrentGuess("");
  };

  const handleKeyup = async (event: KeyboardEvent) => {
    const key = event.key;
    const isCurrentGuessMaxLength = currentGuess.length >= 5;

    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === "Enter") {
      
      if (!isCurrentGuessMaxLength) {
        updateContent("Not enough letters", 1500);
        return;
      }

      const isWordExist = await checkWordExist(currentGuess);
      if (!isWordExist) {
        updateContent("Word not exist", 1500);
        return;
      }

      const validatedGuess = validateGuessByAnswer();
      addValidatedGuessToHistoryGuess(validatedGuess);
    } else {
      const isAlphabetKey = /^[A-Za-z]$/.test(key);

      if (isAlphabetKey && !isCurrentGuessMaxLength) {
        setCurrentGuess((prev) => prev + key);
        return;
      }
    }
  };

  return {
    round,
    isCorrect,
    currentGuess,
    historyGuesses,
    usedAlphabets,
    handleKeyup,
  };
};
