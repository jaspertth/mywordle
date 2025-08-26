import http from "http";
import * as crypto from "node:crypto";
import { Server } from "socket.io";
import { envConfig } from "../config";
import { pcManager } from "../pc";
import { findAvailableGameRoom, pickRandomWordFromList } from "../util";
import { handleDisconnect } from "./handler/handle-disconnect";
import { handlePlayerGuess } from "./handler/handle-player-guess";
import { GameRooms } from "./interface";
import { GameDifficulty, GameMode } from "../pc/const";

/**
 * Initializes Socket.IO server and manages game room logic.
 *
 * @param {http.Server} server - The HTTP server instance.
 * @param {string[]} wordList - List of available words for the game.
 * @returns {Server} The Socket.IO server instance.
 */
export const createSocketIO = (server: http.Server, wordList: string[]) => {
  // Configure server with CORS enabled for specific origins
  const io = new Server(server, {
    cors: {
      origin: envConfig().corsOrigin,
      methods: ["GET", "POST"],
    },
  });

  const gameRooms: GameRooms = {};

  io.on("connection", (player) => {
    const { gameMode, gameDifficulty } = player.handshake.query;
    player.emit("playerId", player.id);

    // Find an existing game room
    let gameRoomId: string | null = null;
    if (gameMode === GameMode.PVP) {
      gameRoomId = findAvailableGameRoom(gameRooms);
    }
    // Create a new game room if no available game room or PVE mode
    if (!gameRoomId || gameMode === GameMode.PVE) {
      gameRoomId = crypto.randomUUID();
      const pickedWord = pickRandomWordFromList(wordList);
      gameRooms[gameRoomId] = {
        players: {},
        pickedWord,
      };
    }

    // Add the player to the game room
    const gameRoom = gameRooms[gameRoomId];
    gameRoom.players[player.id] = [];
    player.join(gameRoomId);
    player.emit("gameRoomId", gameRoomId);

    // Add pc player immediately if PVE mode
    if (gameMode === GameMode.PVE) {
      pcManager.pcPlayercreate({
        gameRoomId,
        wordList,
        gameDifficulty: gameDifficulty as GameDifficulty,
      });
    }

    // Check if the room has only one player
    const playerCount = Object.keys(gameRoom.players).length;
    io.to(gameRoomId).emit(
      "isPlayerEnough",
      playerCount >= envConfig().requriedPlayers
    );

    player.on("disconnect", () => {
      handleDisconnect({ gameId: gameRoomId!, gameRooms, io, player });
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
