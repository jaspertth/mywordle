import { useContext, useState } from "react";
import { SocketContext } from "../providers/socket-provider";
import { ToastContext } from "../providers/toast-provider";
import { checkWordExist, envConfig } from "../util";
import { ValidateResult } from "./const";
import {
  CharacterWithValidation,
  UsedAlphabets,
  WinningEvent,
} from "./interface";

export const useWordle = () => {
  const [round, setRound] = useState<number>(0);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [historyGuesses, setHstoryGuesses] = useState<
    CharacterWithValidation[][]
  >([...Array(envConfig().maxRound)]);
  const [usedAlphabets, setUsedAlphabets] = useState<UsedAlphabets>({});

  const { updateContent } = useContext(ToastContext);
  const { socket } = useContext(SocketContext);

  const validateGuessByAnswer = (): Promise<CharacterWithValidation[]> => {
    return new Promise((resolve) => {
      socket.emit("playerGuess", currentGuess);
      socket.once(
        "validated",
        (validatedCharacters: CharacterWithValidation[]) => {
          setUsedAlphabets((prev) => {
            const newUsedAlphabets = { ...prev };

            validatedCharacters.forEach((validatedChar) => {
              const prevValidatedResult =
                newUsedAlphabets[validatedChar.character];
              if (
                validatedChar.validateResult === ValidateResult.Correct ||
                (validatedChar.validateResult === ValidateResult.Present &&
                  prevValidatedResult !== ValidateResult.Correct) ||
                (validatedChar.validateResult === ValidateResult.Absent &&
                  prevValidatedResult !== ValidateResult.Correct &&
                  prevValidatedResult !== ValidateResult.Present)
              ) {
                newUsedAlphabets[validatedChar.character] =
                  validatedChar.validateResult;
              }
            });

            return newUsedAlphabets;
          });
          setRound((prev) => prev + 1);

          resolve(validatedCharacters);
        }
      );

      socket.once("winning", ({ type, message }: WinningEvent) => {
        if (type === "draw") {
          console.log("message", message);
          updateContent(message);
        } else {
          updateContent(message === socket.id ? "you won" : "you lost");
        }

        setIsGameEnd(true);
      });
    });
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
    const isCurrentGuessMaxLength =
      currentGuess.length >= envConfig().maxWordLength;

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
    isGameEnd,
    currentGuess,
    historyGuesses,
    usedAlphabets,
    handleKeyup,
  };
};
