import { CharacterWithValidation } from "../../hooks/interface";

export interface RowProps {
  historyGuess?: CharacterWithValidation[];
  currentGuess?: string;
}
