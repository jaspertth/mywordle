"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const util_1 = require("./util");
const socket_1 = require("./socket");
const config_1 = require("./config");
dotenv_1.default.config();
const port = (0, config_1.envConfig)().port || 4000;
const dictionaryFilePath = (0, config_1.envConfig)().dictionaryFilePath;
const wordList = (0, util_1.loadWordsFromJSON)(dictionaryFilePath);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = (0, socket_1.createSocketIO)(server, wordList);
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).send("OK");
});
server.listen(port, () => console.log(`Listening port ${port}.`));
