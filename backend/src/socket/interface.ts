import { Server, Socket } from "socket.io";
import { ValidateResult } from "./const";

export interface ValidatedCharacter {
  character: string;
  validateResult: ValidateResult;
}

export interface GameRooms {
  [gameRoomId: string]: {
    players: { [playerId: string]: ValidatedCharacter[][] };
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

export interface HandleDisconnectParams {
  player: Socket;
  gameRooms: GameRooms;
  io: Server;
  gameId: string;
}
