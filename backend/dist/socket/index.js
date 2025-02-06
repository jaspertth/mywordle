"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketIO = void 0;
const socket_io_1 = require("socket.io");
const util_1 = require("../util");
const crypto = __importStar(require("node:crypto"));
const handle_player_guess_1 = require("./handler/handle-player-guess");
const handle_disconnect_1 = require("./handler/handle-disconnect");
const config_1 = require("../config");
/**
 * Initializes Socket.IO server and manages game room logic.
 *
 * @param {http.Server} server - The HTTP server instance.
 * @param {string[]} wordList - List of available words for the game.
 * @returns {Server} The Socket.IO server instance.
 */
const createSocketIO = (server, wordList) => {
    // Configure server with CORS enabled
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    const gameRooms = {};
    io.on("connection", (player) => {
        player.emit("playerId", player.id);
        // Find or create a new game room
        let gameRoomId = (0, util_1.findAvailableGameRoom)(gameRooms);
        if (!gameRoomId) {
            gameRoomId = crypto.randomUUID();
            gameRooms[gameRoomId] = {
                players: {},
                pickedWord: (0, util_1.pickRandomWordFromList)(wordList),
            };
        }
        player.emit("gameRoomId", gameRoomId);
        const gameRoom = gameRooms[gameRoomId];
        // Add the player to the game room
        gameRoom.players[player.id] = [];
        player.join(gameRoomId);
        const isPlayerEnough = Object.keys(gameRoom.players).length === (0, config_1.envConfig)().requriedPlayers;
        io.to(gameRoomId).emit("isPlayerEnough", isPlayerEnough);
        player.on("disconnect", () => (0, handle_disconnect_1.handleDisconnect)({ gameId: gameRoomId, gameRooms, io, player }));
        player.on("playerGuess", (currentGuess) => {
            const lowerCaseCurrentGuess = currentGuess.toLowerCase();
            (0, handle_player_guess_1.handlePlayerGuess)({
                wordList,
                player,
                currentGuess: lowerCaseCurrentGuess,
                gameRoom,
                io,
                gameId: gameRoomId,
            });
        });
    });
    return io;
};
exports.createSocketIO = createSocketIO;
