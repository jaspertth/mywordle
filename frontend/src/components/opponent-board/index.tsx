import { envConfig } from "../../util";
import { Row } from "../row";
import { OpponentBoardProps } from "./interfaces";

export const OpponentBoard: React.FC<OpponentBoardProps> = ({
  opponentHistoryGuesses,
}) => {
  return (
    <div className="opponent">
      <div style={{ fontSize: "clamp(0.5rem, 2vw, 1rem)", fontWeight: "bold" }}>
        Your opponent process
      </div>
      {Array.from({ length: envConfig().maxRound }).map((_, i) => {
        return <Row key={i} historyGuess={opponentHistoryGuesses[i]} />;
      })}
    </div>
  );
};
