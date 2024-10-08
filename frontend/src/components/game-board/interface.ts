import { CharacterWithValidation } from "../../hooks/interface";

export interface GameBoardProps {
  round: number;
  historyGuesses: CharacterWithValidation[][];
  currentGuess: string;
}
