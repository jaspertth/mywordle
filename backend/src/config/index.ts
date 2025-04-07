import path from "path";
import { EnvironmentVariables } from "./interface";

/**
 * Retrieves configuration settings from environment variables.
 * @returns {EnvironmentVariables} - An object containing the configuration settings.
 */
export const envConfig = (): EnvironmentVariables => {
  const port = process.env.PORT ? +process.env.PORT : 4000;

  const dictionaryFilePath = path.resolve(
    __dirname,
    "..",
    "data",
    "dictionary.json"
  );

  const maxWordLength = process.env.MAX_WORD_LENGTH
    ? +process.env.MAX_WORD_LENGTH
    : 5;

  const maxRound = process.env.MAX_ROUND ? +process.env.MAX_ROUND : 6;

  const requriedPlayers = process.env.REQUIRED_PLAYERS
    ? +process.env.REQUIRED_PLAYERS
    : 2;

  const serverUrl = process.env.SERVER_URL ?? `http://localhost:${port}`;
  return {
    port,
    dictionaryFilePath,
    maxWordLength,
    maxRound,
    requriedPlayers,
    serverUrl,
  };
};
