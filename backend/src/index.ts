import express from "express";
import dotenv from "dotenv";
import http from "http";
import { loadWordsFromJSON } from "./util";
import { createSocketIO } from "./socket";
import { envConfig } from "./config";

dotenv.config();

const port = envConfig().port || 4000;
const dictionaryFilePath = envConfig().dictionaryFilePath;

const wordList: string[] = loadWordsFromJSON(dictionaryFilePath);

const app = express();
const server = http.createServer(app);
const io = createSocketIO(server, wordList);

app.use(express.json());

server.listen(port, () => console.log(`Listening port ${port}.`));
