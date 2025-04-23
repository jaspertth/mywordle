import { envConfig } from "../config";
import { PCPlayer } from "./pc-player";

export class PCManager {
  private joinTimers: Map<string, NodeJS.Timeout> = new Map();
  private pcPlayers: Map<string, PCPlayer> = new Map();

  constructor() {}

  /**
   * Track an idle gameroom
   * @param gameRoomId The gameroom ID
   * @param wordList The word list
   */
  public startJoinTimer(gameRoomId: string, wordList: string[]): void {
    if (this.joinTimers.has(gameRoomId)) {
      return;
    }

    // Set a timeout to join with a PC player after 7 seconds
    const timeout = setTimeout(() => {
      // Create a PC player and join the game
      const pcPlayer = new PCPlayer(wordList);
      this.pcPlayers.set(gameRoomId, pcPlayer);
      this.joinTimers.delete(gameRoomId);
    }, envConfig().pcPlayerJoinDelayMs);
    this.joinTimers.set(gameRoomId, timeout);
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
