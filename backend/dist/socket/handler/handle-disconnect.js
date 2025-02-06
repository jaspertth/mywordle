"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDisconnect = void 0;
/**
 * Handles the disconnection of a player from the game.
 * This function removes the player from the game room's player list,
 * disconnects their opponent if any, and deletes the game room.
 *
 * @param {HandleDisconnectParams} params - The parameters needed for handling the disconnect.
 * @param {string} params.gameId - The ID of the game room from which the player is disconnecting.
 * @param {GameRooms} params.gameRooms - The current state of all game rooms.
 * @param {SocketIO.Server} params.io - The Socket.IO server instance used for communication.
 * @param {Player} params.player - The player object representing the disconnecting player.
 * @returns {boolean} - Returns true if the disconnect handling was successful.
 */
const handleDisconnect = ({ gameId, gameRooms, io, player, }) => {
    var _a;
    delete gameRooms[gameId].players[player.id];
    const opponentId = Object.keys(gameRooms[gameId].players)[0];
    if (!!opponentId) {
        io.to(gameId).emit("opponentDisconnected", "your opponent left the game. refresh to join another game");
        (_a = io.sockets.sockets.get(opponentId)) === null || _a === void 0 ? void 0 : _a.disconnect(true);
    }
    delete gameRooms[gameId];
    return opponentId;
};
exports.handleDisconnect = handleDisconnect;
