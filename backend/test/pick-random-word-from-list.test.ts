import { pickRandomWordFromList } from "../src/util"; // adjust this import to the actual file

describe("pickRandomWordFromList", () => {
  it("should return a word from the provided list", () => {
    const wordList = ["apple", "bread", "house"];
    const randomWord = pickRandomWordFromList(wordList);
    expect(wordList).toContain(randomWord);
  });
});
