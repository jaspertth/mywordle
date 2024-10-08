import http from "http";
import { Server } from "socket.io";
import { GameRooms } from "./interface";
import {
  envConfig,
  findAvailableGameRoom,
  pickRandomWordFromList,
} from "../util";
import * as crypto from "node:crypto";
import { handlePlayerGuess } from "./handlePlayerGuess";
import { handleDisconnect } from "./handleDisconnect";

export const createSocketIO = (server: http.Server, wordList: string[]) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const gameRooms: GameRooms = {};

  io.on("connection", (player) => {
    console.log("player connected, id: ", player.id);
    player.emit("playerId", player.id);

    // Check if there is an available game room, if no create one
    let gameId = findAvailableGameRoom(gameRooms);
    if (!gameId) {
      gameId = crypto.randomUUID();
      gameRooms[gameId] = {
        players: {},
        pickedWord: pickRandomWordFromList(wordList),
      };
    }

    // join available game room
    const gameRoom = gameRooms[gameId!];
    gameRoom.players[player.id] = [];
    console.log(gameRoom.pickedWord);
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
