import express, { Response } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import path from "path";
import { loadWordsFromJSON, pickRandomWordFromList } from "./util";
import checkAnswerRouter from "./routes/check-answer";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
const dictionarFilePath = process.env.DICTIONARY_FILE_PATH
  ? path.join(__dirname, "..", process.env.DICTIONARY_FILE_PATH!)
  : path.join(__dirname, "data", "dictionary.json");

const wordList: string[] = loadWordsFromJSON(dictionarFilePath);
let pickedWord = pickRandomWordFromList(wordList);


cron.schedule('*/30 * * * * *', () => {
  pickedWord = pickRandomWordFromList(wordList);
  console.log(`Word picked: ${pickedWord}`);
});

app.use(express.json());

// Middleware to expose currentWord
app.use((_, response: Response<{}, {pickedWord: string}>, next) => {
  response.locals.pickedWord = pickedWord; // Make currentWord available to all routes
  next();
});

app.use("/api", checkAnswerRouter)

app.listen(port, () =>
  console.log(`Listening port ${port}. Word picked: ${pickedWord}`)
);
