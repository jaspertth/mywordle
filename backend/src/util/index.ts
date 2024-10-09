import fs from "fs";
import path from "path";
import { GameRooms } from "../socket/interface";

/**
 * Loads words from a JSON file.
 * @param {string} dictionaryFilePath - The path to the JSON file containing words.
 * @returns {string[]} - An array of words loaded from the JSON file.
 */
export const loadWordsFromJSON = (dictionarFilePath: string): string[] => {
  const data = fs.readFileSync(dictionarFilePath, "utf-8");
  const jsonData = JSON.parse(data);
  return jsonData.words;
};

/**
 * Picks a random word from a list of words.
 * @param {string[]} wordlist - An array of words to choose from.
 * @returns {string} - A randomly selected word from the list.
 */
export const pickRandomWordFromList = (wordlist: string[]): string => {
  const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)];
  return randomWord;
};

/**
 * Finds an available game room that has fewer than the required number of players.
 * @param {GameRooms} gameRooms - An object representing all game rooms.
 * @returns {string | null} - The ID of an available game room, or null if none are available.
 */
export const findAvailableGameRoom = (gameRooms: GameRooms) => {
  for (const gameId in gameRooms) {
    const gameRoom = gameRooms[gameId];
    if (Object.keys(gameRoom.players).length < 2) {
      return gameId;
    }
  }
  return null;
};
