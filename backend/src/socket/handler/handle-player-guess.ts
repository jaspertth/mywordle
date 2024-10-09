import { Server, Socket } from "socket.io";
import { envConfig } from "../../config";
import { ValidateResult } from "../const";
import {
  GameRooms,
  HandlePlayerGuessParams,
  ValidatedCharacter,
} from "../interface";

/**
 * Counts the frequency of each character in the given word.
 *
 * @param {string} word - The word for which to count character frequencies.
 * @returns {Object} - An object with characters as keys and their counts as values.
 */
const countCharacterFrequencies = (word: string): { [key: string]: number } => {
  const frequencies: { [key: string]: number } = {};
  for (const char of word) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  return frequencies;
};

/**
 * Validates the player's guess against the picked word.
 *
 * @param {string} currentGuess - The word guessed by the player.
 * @param {string} pickedWord - The word chosen by the game.
 * @returns {ValidatedCharacter[]} - The array of validated characters.
 */
export const validateGuess = (
  currentGuess: string,
  pickedWord: string
): ValidatedCharacter[] => {
  const validatedCharacters = [...currentGuess].map<ValidatedCharacter>(
    (character) => ({
      character,
      validateResult: ValidateResult.Absent,
    })
  );

  const characterFrequencies: { [key: string]: number } =
    countCharacterFrequencies(pickedWord);

  // Handle "correct" characters
  for (let i = 0; i < validatedCharacters.length; i++) {
    const validatedChar = validatedCharacters[i];
    if (validatedChar.character === pickedWord[i]) {
      validatedChar.validateResult = ValidateResult.Correct;
      characterFrequencies[validatedChar.character]--;
    }
  }

  // Handle "present" characters
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

  return validatedCharacters;
};

/**
 * Checks the game status to determine if there's a win or draw.
 *
 * @param {Server} io - The Socket.IO server instance.
 * @param {GameRooms["gameRoomId"]} gameRoom - The current game room.
 * @param {Player} player - The player who made the guess.
 * @param {string} currentGuess - The word guessed by the player.
 * @param {string} gameId - The ID of the current game.
 */
const checkGameStatus = (
  io: Server,
  gameRoom: GameRooms["gameRoomId"],
  player: Socket,
  currentGuess: string,
  gameId: string
) => {
  const isAllPlayerUsedChances = Object.values(gameRoom.players).every(
    (historyGuesses) => historyGuesses.length >= envConfig().maxRound
  );
  const isCurrentGuessCorrect = currentGuess === gameRoom.pickedWord;

  // Handle draw situation
  if (isAllPlayerUsedChances && !isCurrentGuessCorrect) {
    io.to(gameId).emit("winning", {
      type: "draw",
      message: "game draw",
    });
  }

  // Handle win situation
  if (!isAllPlayerUsedChances && isCurrentGuessCorrect) {
    io.to(gameId).emit("winning", { type: "end", message: player.id });
  }
};

export const handlePlayerGuess = ({
  wordList,
  player,
  currentGuess,
  gameRoom,
  io,
  gameId,
}: HandlePlayerGuessParams) => {
  // Store the validated characters in the player's history
  const validatedCharacters = validateGuess(currentGuess, gameRoom.pickedWord);
  gameRoom.players[player.id].push(validatedCharacters);

  //update the player with the validated characters
  player.emit("validated", validatedCharacters);

  //update the opponent with the validation result only
  const validationResultOnly = validatedCharacters.map((validatedChar) => ({
    validatedChar: "",
    validateResult: validatedChar.validateResult,
  }));
  player.to(gameId!).emit("opponentProgress", validationResultOnly);

  checkGameStatus(io, gameRoom, player, currentGuess, gameId);
};
