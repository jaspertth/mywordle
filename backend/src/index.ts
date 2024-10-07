import express, { Response } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import cors from "cors";
import path from "path";
import { loadWordsFromJSON, pickRandomWordFromList } from "./util";
import checkAnswerRouter from "./routes/check-answer";
import checkConnectionRouter from "./routes/check-connection";
import getAnswerRouter from "./routes/get-answer";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
const dictionarFilePath = process.env.DICTIONARY_FILE_PATH
  ? path.join(__dirname, "..", process.env.DICTIONARY_FILE_PATH!)
  : path.join(__dirname, "data", "dictionary.json");

const wordList: string[] = loadWordsFromJSON(dictionarFilePath);
let pickedWord = pickRandomWordFromList(wordList);

cron.schedule("* */30 * * * *", () => {
  pickedWord = pickRandomWordFromList(wordList);
  console.log(`Word picked: ${pickedWord}`);
});

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

app.listen(port, () =>
  console.log(`Listening port ${port}. Word picked: ${pickedWord}`)
);
