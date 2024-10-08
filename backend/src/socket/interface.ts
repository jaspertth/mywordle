import { Server, Socket } from "socket.io";
import { CharacterWithValidation } from "../routes/check-answer/interface";
import { handleDisconnect } from "./handleDisconnect";

export interface GameRooms {
  [gameRoomId: string]: {
    players: { [playerId: string]: CharacterWithValidation[][] };
    pickedWord: string;
  };
}

export interface HandlePlayerGuessParams {
  player: Socket;
  currentGuess: string;
  gameRoom: GameRooms["gameRoomId"];
  io: Server;
  gameId: string;
}

export interface handleDisconnectParams {
  player: Socket;
  gameRooms: GameRooms;
  io: Server;
  gameId: string;
}
