import { ValidateResult } from "../src/socket/const";
import { validateGuess } from "../src/socket/handler/handle-player-guess";
import { ValidatedCharacter } from "../src/socket/interface";

describe("validateGuess", () => {
  it("should validate a guess with correct characters", () => {
    const currentGuess = "apple";
    const pickedWord = "apple";

    const result = validateGuess(currentGuess, pickedWord);

    // Expect all characters to be marked as Correct
    const expected: ValidatedCharacter[] = [
      { character: "a", validateResult: ValidateResult.Correct },
      { character: "p", validateResult: ValidateResult.Correct },
      { character: "p", validateResult: ValidateResult.Correct },
      { character: "l", validateResult: ValidateResult.Correct },
      { character: "e", validateResult: ValidateResult.Correct },
    ];

    expect(result).toEqual(expected);
  });

  it("should validate a guess with present characters", () => {
    const currentGuess = "rates";
    const pickedWord = "stare";

    const result = validateGuess(currentGuess, pickedWord);

    // Expect first character to be Present, rest to be Correct/Absent
    const expected: ValidatedCharacter[] = [
      { character: "r", validateResult: ValidateResult.Present },
      { character: "a", validateResult: ValidateResult.Present },
      { character: "t", validateResult: ValidateResult.Present },
      { character: "e", validateResult: ValidateResult.Present },
      { character: "s", validateResult: ValidateResult.Present },
    ];

    expect(result).toEqual(expected);
  });

  it("should validate a guess with absent characters", () => {
    const currentGuess = "paper";
    const pickedWord = "cloud";

    const result = validateGuess(currentGuess, pickedWord);

    // Expect all characters to be marked as Absent
    const expected: ValidatedCharacter[] = [
      { character: "p", validateResult: ValidateResult.Absent },
      { character: "a", validateResult: ValidateResult.Absent },
      { character: "p", validateResult: ValidateResult.Absent },
      { character: "e", validateResult: ValidateResult.Absent },
      { character: "r", validateResult: ValidateResult.Absent },
    ];

    expect(result).toEqual(expected);
  });

  it("should handle a mix of correct, present, and absent characters", () => {
    const currentGuess = "bread";
    const pickedWord = "bored";

    const result = validateGuess(currentGuess, pickedWord);

    const expected: ValidatedCharacter[] = [
      { character: "b", validateResult: ValidateResult.Correct },
      { character: "r", validateResult: ValidateResult.Present },
      { character: "e", validateResult: ValidateResult.Present },
      { character: "a", validateResult: ValidateResult.Absent },
      { character: "d", validateResult: ValidateResult.Correct },
    ];

    expect(result).toEqual(expected);
  });

  it("should handle duplicate characters correctly", () => {
    const currentGuess = "paper";
    const pickedWord = "plane";

    const result = validateGuess(currentGuess, pickedWord);

    const expected: ValidatedCharacter[] = [
      { character: "p", validateResult: ValidateResult.Correct },
      { character: "a", validateResult: ValidateResult.Present },
      { character: "p", validateResult: ValidateResult.Absent },
      { character: "e", validateResult: ValidateResult.Present },
      { character: "r", validateResult: ValidateResult.Absent },
    ];

    expect(result).toEqual(expected);
  });
});
