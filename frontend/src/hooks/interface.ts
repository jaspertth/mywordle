import { ValidateResult } from "./const";

export interface CharacterWithValidation {
  character: string;
  validateResult: ValidateResult;
}

export interface UsedAlphabets {
  [key: string]: ValidateResult;
}

export interface WinningEvent {
  type: "draw" | "end";
  message: string;
}
