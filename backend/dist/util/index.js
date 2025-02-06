"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAvailableGameRoom = exports.pickRandomWordFromList = exports.loadWordsFromJSON = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Loads words from a JSON file.
 * @param {string} dictionaryFilePath - The path to the JSON file containing words.
 * @returns {string[]} - An array of words loaded from the JSON file.
 */
const loadWordsFromJSON = (dictionarFilePath) => {
    const data = fs_1.default.readFileSync(dictionarFilePath, "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData.words;
};
exports.loadWordsFromJSON = loadWordsFromJSON;
/**
 * Picks a random word from a list of words.
 * @param {string[]} wordlist - An array of words to choose from.
 * @returns {string} - A randomly selected word from the list.
 */
const pickRandomWordFromList = (wordlist) => {
    const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)];
    return randomWord;
};
exports.pickRandomWordFromList = pickRandomWordFromList;
/**
 * Finds an available game room that has fewer than the required number of players.
 * @param {GameRooms} gameRooms - An object representing all game rooms.
 * @returns {string | null} - The ID of an available game room, or null if none are available.
 */
const findAvailableGameRoom = (gameRooms) => {
    for (const gameId in gameRooms) {
        const gameRoom = gameRooms[gameId];
        if (Object.keys(gameRoom.players).length < 2) {
            return gameId;
        }
    }
    return null;
};
exports.findAvailableGameRoom = findAvailableGameRoom;
