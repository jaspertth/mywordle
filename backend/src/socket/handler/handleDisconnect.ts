import { HandleDisconnectParams } from "../interface";

/**
 * Handles the disconnection of a player from the game.
 * This function removes the player from the game room's player list, disconnects their opponent if any,
 * and deletes the game room if there are no remaining players.
 *
 * @param {HandleDisconnectParams} params - The parameters needed for handling the disconnect.
 * @param {string} params.gameId - The ID of the game room from which the player is disconnecting.
 * @param {GameRooms} params.gameRooms - The current state of all game rooms.
 * @param {SocketIO.Server} params.io - The Socket.IO server instance used for communication.
 * @param {Player} params.player - The player object representing the disconnecting player.
 * @returns {boolean} - Returns true if the disconnect handling was successful.
 */
export const handleDisconnect = ({
  gameId,
  gameRooms,
  io,
  player,
}: HandleDisconnectParams): boolean => {
  delete gameRooms[gameId].players[player.id];
  const opponentId = Object.keys(gameRooms[gameId].players)[0];
  if (opponentId) {
    io.sockets.sockets.get(opponentId)?.disconnect(true);
  }
  delete gameRooms[gameId];
  return true;
};
