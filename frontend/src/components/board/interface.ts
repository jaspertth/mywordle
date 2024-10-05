import { CharacterWithValidation } from "../../hooks/interface";

export interface BoardProps {
  round: number;
  historyGuesses: CharacterWithValidation[][];
  currentGuess: string;
}
