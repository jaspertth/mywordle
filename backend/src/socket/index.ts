import http from "http";
import { Server } from "socket.io";
import { GameRooms } from "./interface";
import { findAvailableGameRoom, pickRandomWordFromList } from "../util";
import * as crypto from "node:crypto";
import { handlePlayerGuess } from "./handler/handle-player-guess";
import { handleDisconnect } from "./handler/handle-disconnect";
import { envConfig } from "../config";

/**
 * Initializes Socket.IO server and manages game room logic.
 *
 * @param {http.Server} server - The HTTP server instance.
 * @param {string[]} wordList - List of available words for the game.
 * @returns {Server} The Socket.IO server instance.
 */
export const createSocketIO = (server: http.Server, wordList: string[]) => {
  // Configure server with CORS enabled
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const gameRooms: GameRooms = {};

  io.on("connection", (player) => {
    player.emit("playerId", player.id);

    // Find or create a new game room
    let gameRoomId = findAvailableGameRoom(gameRooms);
    if (!gameRoomId) {
      gameRoomId = crypto.randomUUID();
      gameRooms[gameRoomId] = {
        players: {},
        pickedWord: pickRandomWordFromList(wordList),
      };
    }

    player.emit("gameRoomId", gameRoomId);

    const gameRoom = gameRooms[gameRoomId!];

    // Add the player to the game room
    gameRoom.players[player.id] = [];
    player.join(gameRoomId);

    const isPlayerEnough =
      Object.keys(gameRoom.players).length === envConfig().requriedPlayers;
    io.to(gameRoomId).emit("isPlayerEnough", isPlayerEnough);

    player.on("disconnect", () =>
      handleDisconnect({ gameId: gameRoomId!, gameRooms, io, player })
    );

    player.on("playerGuess", (currentGuess: string) => {
      const lowerCaseCurrentGuess = currentGuess.toLowerCase();
      handlePlayerGuess({
        wordList,
        player,
        currentGuess: lowerCaseCurrentGuess,
        gameRoom,
        io,
        gameId: gameRoomId!,
      });
    });
  });
  return io;
};
