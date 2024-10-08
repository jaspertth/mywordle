import http from "http";
import { Server } from "socket.io";
import { GameRooms } from "./interface";
import { findAvailableGameRoom, pickRandomWordFromList } from "../util";
import * as crypto from "node:crypto";
import { handlePlayerGuess } from "./handler/handlePlayerGuess";
import { handleDisconnect } from "./handler/handleDisconnect";
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
    let gameId = findAvailableGameRoom(gameRooms);
    if (!gameId) {
      gameId = crypto.randomUUID();
      gameRooms[gameId] = {
        players: {},
        pickedWord: pickRandomWordFromList(wordList),
      };
    }

    const gameRoom = gameRooms[gameId!];

    // Add the player to the game room
    gameRoom.players[player.id] = [];
    player.join(gameId);

    const isPlayerEnough =
      Object.keys(gameRoom.players).length === envConfig().requriedPlayers;
    io.to(gameId).emit("isPlayerEnough", isPlayerEnough);

    player.on("disconnect", () =>
      handleDisconnect({ gameId: gameId!, gameRooms, io, player })
    );

    player.on("playerGuess", (currentGuess: string) =>
      handlePlayerGuess({ player, currentGuess, gameRoom, io, gameId: gameId! })
    );
  });
  return io;
};
