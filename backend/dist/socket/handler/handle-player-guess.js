"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlayerGuess = exports.validateGuess = void 0;
const config_1 = require("../../config");
const const_1 = require("../const");
/**
 * Counts the frequency of each character in the given word.
 *
 * @param {string} word - The word for which to count character frequencies.
 * @returns {Object} - An object with characters as keys and their counts as values.
 */
const countCharacterFrequencies = (word) => {
    const frequencies = {};
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
const validateGuess = (currentGuess, pickedWord) => {
    const validatedCharacters = [...currentGuess].map((character) => ({
        character,
        validateResult: const_1.ValidateResult.Absent,
    }));
    const characterFrequencies = countCharacterFrequencies(pickedWord);
    // Handle "correct" characters
    for (let i = 0; i < validatedCharacters.length; i++) {
        const validatedChar = validatedCharacters[i];
        if (validatedChar.character === pickedWord[i]) {
            validatedChar.validateResult = const_1.ValidateResult.Correct;
            characterFrequencies[validatedChar.character]--;
        }
    }
    // Handle "present" characters
    for (let i = 0; i < validatedCharacters.length; i++) {
        const validatedChar = validatedCharacters[i];
        if (validatedChar.validateResult !== const_1.ValidateResult.Correct &&
            characterFrequencies[validatedChar.character] > 0) {
            validatedChar.validateResult = const_1.ValidateResult.Present;
            characterFrequencies[validatedChar.character]--;
        }
    }
    return validatedCharacters;
};
exports.validateGuess = validateGuess;
/**
 * Checks the game status to determine if there's a win or draw.
 *
 * @param {Server} io - The Socket.IO server instance.
 * @param {GameRooms["gameRoomId"]} gameRoom - The current game room.
 * @param {Player} player - The player who made the guess.
 * @param {string} currentGuess - The word guessed by the player.
 * @param {string} gameId - The ID of the current game.
 */
const checkGameStatus = (io, gameRoom, player, currentGuess, gameId) => {
    const isAllPlayerUsedChances = Object.values(gameRoom.players).every((historyGuesses) => historyGuesses.length >= (0, config_1.envConfig)().maxRound);
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
const handlePlayerGuess = ({ wordList, player, currentGuess, gameRoom, io, gameId, }) => {
    // Store the validated characters in the player's history
    const validatedCharacters = (0, exports.validateGuess)(currentGuess, gameRoom.pickedWord);
    gameRoom.players[player.id].push(validatedCharacters);
    //update the player with the validated characters
    player.emit("validated", validatedCharacters);
    //update the opponent with the validation result only
    const validationResultOnly = validatedCharacters.map((validatedChar) => ({
        validatedChar: "",
        validateResult: validatedChar.validateResult,
    }));
    player.to(gameId).emit("opponentProgress", validationResultOnly);
    checkGameStatus(io, gameRoom, player, currentGuess, gameId);
};
exports.handlePlayerGuess = handlePlayerGuess;
