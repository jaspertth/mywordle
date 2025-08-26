import { GameRooms } from "../socket/interface";
import { GameDifficulty, GameMode } from "./const";

export interface PcPlayerCreateParams {
  gameRoomId: string;
  wordList: string[];
  gameDifficulty: GameDifficulty;
}

export interface PcPlayerJoinParams {
  gameRooms: GameRooms;
  gameRoomId: string;
}
