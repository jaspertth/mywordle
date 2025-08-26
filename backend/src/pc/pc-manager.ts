import { envConfig } from "../config";
import { PcPlayerCreateParams, PcPlayerJoinParams } from "./interface";
import { PCPlayer } from "./pc-player";

export class PCManager {
  private joinTimers: Map<string, NodeJS.Timeout> = new Map();
  private pcPlayers: Map<string, PCPlayer> = new Map();

  constructor() {}

  /**
   * Track an idle gameroom
   * @param gameRoomId The gameroom ID
   * @param wordList The word list
   * @param gameDifficulty The game difficulty
   */
  public pcPlayercreate(params: PcPlayerCreateParams): PCManager {
    const { gameRoomId, wordList, gameDifficulty } = params;
    // Create a PC player and join the game
    const pcPlayer = new PCPlayer(wordList, gameDifficulty);
    this.pcPlayers.set(gameRoomId, pcPlayer);
    return this;
  }

  public pcPlayerJoin(params: PcPlayerJoinParams): void {
    const { gameRoomId, gameRooms } = params;
    // Create a PC player and join the game
    const pcPlayer = this.pcPlayers.get(gameRoomId);
    if (!!pcPlayer) {
      // Add the player to the game room
      const gameRoom = gameRooms[gameRoomId];
      gameRoom.players[pcPlayer.pcPlayerSocketClient.id!] = [];
    }
  }

  /**
   * Cancel tracking an idle gameroom
   * @param gameRoomId The gameroom ID
   */
  public cancelJoinTimer(gameRoomId: string): void {
    const timeout = this.joinTimers.get(gameRoomId);
    if (timeout) {
      clearTimeout(timeout);
      this.joinTimers.delete(gameRoomId);
      this.pcPlayers.delete(gameRoomId);
    }
  }
}
