import { Request, Response, Router } from "express";
import { CharacterWithValidation, CheckAnswerRequestBody } from "./interface";
import { ValidateResult } from "./const";

const router = Router();

router.post(
  "/check-answer",
  (
    request: Request<{}, {}, CheckAnswerRequestBody>,
    response: Response<CharacterWithValidation[], { pickedWord: string }>
  ) => {
    const guess = request.body.guess;
    const pickedWord = response.locals.pickedWord;
    const validatedCharacters = [...guess].map<CharacterWithValidation>(
      (character) => ({ character, validateResult: ValidateResult.Absent })
    );

    // tracking a single character frequency in the word
    const characterFrequencies: { [key: string]: number } = {};

    // counting each character frequency
    for (let i = 0; i < pickedWord.length; i++) {
      const char = pickedWord[i];
      if (characterFrequencies[char]) {
        characterFrequencies[char]++;
      } else {
        characterFrequencies[char] = 1;
      }
    }

    // handle "correct"
    for (let i = 0; i < validatedCharacters.length; i++) {
      const validatedChar = validatedCharacters[i];
      if (validatedChar.character === pickedWord[i]) {
        validatedChar.validateResult = ValidateResult.Correct;
        characterFrequencies[validatedChar.character]--;
      }
    }

    // handle "present"
    for (let i = 0; i < validatedCharacters.length; i++) {
      const validatedChar = validatedCharacters[i];
      if (
        validatedChar.validateResult !== ValidateResult.Correct &&
        characterFrequencies[validatedChar.character] > 0
      ) {
        validatedChar.validateResult = ValidateResult.Present;
        characterFrequencies[validatedChar.character]--;
      }
    }
    response.json(validatedCharacters);
  }
);

export default router;
