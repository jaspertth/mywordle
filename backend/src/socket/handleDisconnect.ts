import { handleDisconnectParams } from "./interface";

export const handleDisconnect = ({
  gameId,
  gameRooms,
  io,
  player,
}: handleDisconnectParams) => {
  delete gameRooms[gameId].players[player.id];
  const opponentId = Object.keys(gameRooms[gameId].players)[0];
  if (opponentId) {
    io.sockets.sockets.get(opponentId)?.disconnect(true);
  }
  delete gameRooms[gameId];
};
