import { findAvailableGameRoom } from "../src/util";
import { GameRooms } from "../src/socket/interface";

describe("findAvailableGameRoom", () => {
  it("should return the ID of a room with less than 2 players", () => {
    const gameRooms: GameRooms = {
      "room-1": {
        players: { "player-1": [], "player-2": [] },
        pickedWord: "house",
      },
      "room-2": { players: { "player-3": [] }, pickedWord: "bread" },
    };
    const result = findAvailableGameRoom(gameRooms);
    expect(result).toBe("room-2");
  });

  it("should return null if all rooms have 2 or more players", () => {
    const gameRooms: GameRooms = {
      "room-1": {
        players: { "player-1": [], "player-2": [] },
        pickedWord: "house",
      },
      "room-2": {
        players: { "player-3": [], "player-4": [] },
        pickedWord: "bread",
      },
    };
    const result = findAvailableGameRoom(gameRooms);
    expect(result).toBeNull();
  });

  it("should return null if no rooms exist", () => {
    const gameRooms: GameRooms = {};
    const result = findAvailableGameRoom(gameRooms);
    expect(result).toBeNull();
  });
});
