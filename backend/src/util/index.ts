import fs from "fs";
import path from "path";
import { GameRooms } from "../socket/interface";

export const loadWordsFromJSON = (dictionarFilePath: string): string[] => {
  const data = fs.readFileSync(dictionarFilePath, "utf-8");
  const jsonData = JSON.parse(data);
  return jsonData.words;
};

export const pickRandomWordFromList = (wordlist: string[]): string => {
  const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)];
  return randomWord;
};

export const findAvailableGameRoom = (gameRooms: GameRooms) => {
  for (const gameId in gameRooms) {
    const gameRoom = gameRooms[gameId];
    // Check if the game room has less than 2 players
    if (Object.keys(gameRoom.players).length < 2) {
      return gameId;
    }
  }
  return null; // create one if no room available
};

export const envConfig = () => {
  const port = process.env.PORT ? +process.env.PORT : 4000;

  const dictionaryFilePath = process.env.DICTIONARY_FILE_PATH
    ? path.join(__dirname, "..", "..", process.env.DICTIONARY_FILE_PATH!)
    : path.join(__dirname, "..", "data", "dictionary.json");

  const maxWordLength = process.env.MAX_WORD_LENGTH
    ? +process.env.MAX_WORD_LENGTH
    : 5;

  const maxRound = process.env.MAX_ROUND ? +process.env.MAX_ROUND : 6;

  const requriedPlayers = process.env.REQUIRED_PLAYERS
    ? +process.env.REQUIRED_PLAYERS
    : 2;
  return { port, dictionaryFilePath, maxWordLength, maxRound, requriedPlayers };
};
