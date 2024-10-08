import { ValidateResult } from "../routes/check-answer/const";
import { CharacterWithValidation } from "../routes/check-answer/interface";
import { envConfig } from "../util";
import { HandlePlayerGuessParams } from "./interface";

export const handlePlayerGuess = ({
  player,
  currentGuess,
  gameRoom,
  io,
  gameId,
}: HandlePlayerGuessParams) => {
  const validatedCharacters = [...currentGuess].map<CharacterWithValidation>(
    (character) => ({
      character,
      validateResult: ValidateResult.Absent,
    })
  );

  // tracking a single character frequency in the word
  const characterFrequencies: { [key: string]: number } = {};

  // counting each character frequency
  for (let i = 0; i < gameRoom.pickedWord.length; i++) {
    const char = gameRoom.pickedWord[i];
    if (characterFrequencies[char]) {
      characterFrequencies[char]++;
    } else {
      characterFrequencies[char] = 1;
    }
  }

  // handle "correct"
  for (let i = 0; i < validatedCharacters.length; i++) {
    const validatedChar = validatedCharacters[i];
    if (validatedChar.character === gameRoom.pickedWord[i]) {
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
  gameRoom.players[player.id].push(validatedCharacters);

  //update the player with the validated characters
  player.emit("validated", validatedCharacters);

  //update the opponent with the validation result only
  const validationResultOny = validatedCharacters.map(
    (validatedChar) => validatedChar.validateResult
  );
  player.to(gameId!).emit("opponentProgress", validationResultOny);
  //handle draw: all players used all chances and both cannot get the answer
  const isAllPlayerUsedChances = Object.values(gameRoom.players).every(
    (historyGuesses) => historyGuesses.length >= envConfig().maxRound
  );
  if (isAllPlayerUsedChances) {
    io.to(gameId).emit("draw", gameRoom.pickedWord);
  }
};
