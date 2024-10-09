import { checkWordExistence } from "../src/util";

describe("checkWordExistence", () => {
  it("should return true when the word exists in the list", () => {
    const wordList = ["apple", "bread", "house"];
    const currentGuess = "bread";
    const result = checkWordExistence(wordList, currentGuess);
    expect(result).toEqual(true);
  });

  it("should return false when the word not exists in the list", () => {
    const wordList = ["apple", "bread", "house"];
    const currentGuess = "world";
    const result = checkWordExistence(wordList, currentGuess);
    expect(result).toEqual(false);
  });
});
