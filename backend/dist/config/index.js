"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const path_1 = __importDefault(require("path"));
/**
 * Retrieves configuration settings from environment variables.
 * @returns {EnvironmentVariables} - An object containing the configuration settings.
 */
const envConfig = () => {
    const port = process.env.PORT ? +process.env.PORT : 4000;
    const dictionaryFilePath = path_1.default.join(process.cwd(), "dictionary.json");
    const maxWordLength = process.env.MAX_WORD_LENGTH
        ? +process.env.MAX_WORD_LENGTH
        : 5;
    const maxRound = process.env.MAX_ROUND ? +process.env.MAX_ROUND : 6;
    const requriedPlayers = process.env.REQUIRED_PLAYERS
        ? +process.env.REQUIRED_PLAYERS
        : 2;
    return { port, dictionaryFilePath, maxWordLength, maxRound, requriedPlayers };
};
exports.envConfig = envConfig;
