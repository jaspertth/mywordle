import { envConfig } from "../../util";
import { Row } from "../row";
import { OpponentBoardProps } from "./interfaces";

export const OpponentBoard: React.FC<OpponentBoardProps> = ({
  opponentHistoryGuesses,
}) => {
  return (
    <div className="opponent">
      {Array.from({ length: envConfig().maxRound }).map((_, i) => {
        return <Row key={i} historyGuess={opponentHistoryGuesses[i]} />;
      })}
    </div>
  );
};
