import http from "http";
import { Server } from "socket.io";
import { GameRooms } from "./interface";
import { findAvailableGameRoom, pickRandomWordFromList } from "../util";
import * as crypto from "node:crypto";
import { handlePlayerGuess } from "./handler/handle-player-guess";
import { handleDisconnect } from "./handler/handle-disconnect";
import { envConfig } from "../config";
import { pcManager } from "../pc";

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
      const pickedWord = pickRandomWordFromList(wordList);
      console.log(pickedWord);
      gameRooms[gameRoomId] = {
        players: {},
        pickedWord,
      };
    }
    const gameRoom = gameRooms[gameRoomId];
    // Add the player to the game room
    gameRoom.players[player.id] = [];
    player.join(gameRoomId);
    player.emit("gameRoomId", gameRoomId);
    // Check if the room has only one player
    const playerCount = Object.keys(gameRoom.players).length;
    if (playerCount < envConfig().requriedPlayers) {
      // PC player join grameroom if not enough players for some seconds
      io.to(gameRoomId).emit("isPlayerEnough", false);
      pcManager.startJoinTimer(gameRoomId, wordList);
    } else {
      // Cancel PC player join timer if a enough players join
      io.to(gameRoomId).emit("isPlayerEnough", true);
      pcManager.cancelJoinTimer(gameRoomId);
    }

    player.on("disconnect", () => {
      handleDisconnect({ gameId: gameRoomId!, gameRooms, io, player });
      console.log(gameRooms);
    });

    player.on("playerGuess", (currentGuess: string) => {
      const lowerCaseCurrentGuess = currentGuess.toLowerCase();
      handlePlayerGuess({
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
