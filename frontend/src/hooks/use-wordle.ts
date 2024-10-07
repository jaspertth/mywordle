import React, { useContext, useState } from "react";
import { CharacterWithValidation, UsedAlphabets } from "./interface";
import { ValidateResult } from "./const";
import { ToastContext } from "../providers/toast-provider";
import { envConfig } from "../util";

export const useWordle = () => {
  const [round, setRound] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [historyGuesses, setHstoryGuesses] = useState<
    CharacterWithValidation[][]
  >([...Array(envConfig().maxRound)]);
  const [usedAlphabets, setUsedAlphabets] = useState<UsedAlphabets>({});

  const { updateContent } = useContext(ToastContext);

  const checkWordExist = async (word: string) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const status = response.status;
    return status === 200;
  };

  const validateGuessByAnswer = async (): Promise<
    CharacterWithValidation[]
  > => {
    const response = await fetch(
      `${envConfig().serverUrl}/api/check-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess: currentGuess }), // Body must be a JSON string
      }
    );

    const validatedCharacters: CharacterWithValidation[] =
      await response.json();

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

    const isAllCorrect = validatedCharacters.every(
      (validatedCharacter) =>
        validatedCharacter.validateResult === ValidateResult.Correct
    );
    setIsCorrect(isAllCorrect)

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
    const isCurrentGuessMaxLength = currentGuess.length >= envConfig().maxWordLength;

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

      const validatedGuess = await validateGuessByAnswer();
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
