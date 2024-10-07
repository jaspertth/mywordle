import { ValidateResult } from "./const";

export interface CheckAnswerRequestBody {
  guess: string;
}

export interface CharacterWithValidation {
  character: string;
  validateResult: ValidateResult;
}

export interface CheckedGuess {}
