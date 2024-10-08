import express, { Response } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import cors from "cors";
import path from "path";
import http from "http";
import { envConfig, loadWordsFromJSON, pickRandomWordFromList } from "./util";
import checkAnswerRouter from "./routes/check-answer";
import checkConnectionRouter from "./routes/check-connection";
import getAnswerRouter from "./routes/get-answer";
import { createSocketIO } from "./socket";

dotenv.config();

const port = envConfig().port || 4000;
const dictionaryFilePath = envConfig().dictionaryFilePath;

const wordList: string[] = loadWordsFromJSON(dictionaryFilePath);
let pickedWord = pickRandomWordFromList(wordList);

const app = express();
const server = http.createServer(app);
const io = createSocketIO(server, wordList);

// cron.schedule("* * * * * *", () => {
//   pickedWord = pickRandomWordFromList(wordList);
//   io = createSocketIO(server, pickedWord);
// });

app.use(express.json());

// Resolving CORS error
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware to expose pickedWord to all routes
app.use((_, response: Response<{}, { pickedWord: string }>, next) => {
  response.locals.pickedWord = pickedWord;
  next();
});

app.use("/api", checkConnectionRouter);
app.use("/api", checkAnswerRouter);
app.use("/api", getAnswerRouter);

server.listen(port, () => console.log(`Listening port ${port}.`));
