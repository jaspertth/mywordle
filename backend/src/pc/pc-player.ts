import { io as ioClient, Socket as SocketClient } from "socket.io-client";
import { envConfig } from "../config";
import { ValidatedCharacter } from "../socket/interface";

export class PCPlayer {
  private socketClient: SocketClient;
  private guessCount: number;
  private possibleWords: string[];
  private guessTimer: NodeJS.Timeout;

  constructor(wordList: string[]) {
    const socketClient: SocketClient = ioClient(envConfig().serverUrl, {
      reconnection: false,
    });
    this.guessCount = 0;
    this.possibleWords = wordList;
    this.socketClient = socketClient;
    this.socketClient.once("winning", () => {
      clearTimeout(this.guessTimer);
    });
    this.guessTimer = setTimeout(
      () => this.emitGuess("ocean"),
      this.randomDelayMs()
    );
  }

  private randomDelayMs(): number {
    return Math.floor(Math.random() * 25000) + 5000;
  }

  private filterWordListByResult(guessedResult: ValidatedCharacter[]) {
    const filtered = this.possibleWords.filter((word) => {
      // Convert word to array of characters
      const wordChars = word.split("");

      for (let i = 0; i < guessedResult.length; i++) {
        const { character, validateResult } = guessedResult[i];
        if (validateResult === "correct" && wordChars[i] !== character) {
          return false;
        }

        if (validateResult === "present") {
          // Must contain the character but not at this position
          if (!word.includes(character) || wordChars[i] === character) {
            return false;
          }
        }

        if (validateResult === "absent") {
          // Count this character in the word
          const charInWord = wordChars.filter((c) => c === character).length;

          // Count how many times this character is marked as correct or present
          const charInCorrectOrPresent = guessedResult.filter(
            (r) =>
              r.character === character &&
              (r.validateResult === "correct" || r.validateResult === "present")
          ).length;

          // If word has more of this character than accounted for, reject it
          if (charInWord > charInCorrectOrPresent) {
            return false;
          }
        }
      }
      return true;
    });
    this.possibleWords = filtered;
  }

  private chooseWordFromWordList(): string {
    return this.possibleWords[0];
  }

  private emitGuess(wordToGuess: string): void {
    // Check if we've reached the maximum number of guesses
    if (this.guessCount >= envConfig().maxRound) {
      return;
    }
    // Emit guess like human player
    this.socketClient.emit("playerGuess", wordToGuess);
    // Listen for validated guess and filter word list
    this.socketClient.once(
      "validated",
      (guessedResult: ValidatedCharacter[]) => {
        this.filterWordListByResult(guessedResult);
      }
    );
    this.guessCount++;
    this.guessTimer = setTimeout(
      () => this.emitGuess(this.chooseWordFromWordList()),
      this.randomDelayMs()
    );
  }
}
