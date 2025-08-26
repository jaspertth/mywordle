import { io as ioClient, Socket as SocketClient } from "socket.io-client";
import { envConfig } from "../config";
import { ValidatedCharacter } from "../socket/interface";
import { GameDifficulty } from "./const";
import { ValidateResult } from "../socket/const";

export class PCPlayer {
  private socketClient: SocketClient;
  private guessCount: number;
  private possibleWords: string[];
  private guessTimer: NodeJS.Timeout;
  private gameDifficulty: GameDifficulty;

  constructor(wordList: string[], gameDifficulty: GameDifficulty) {
    const socketClient: SocketClient = ioClient(envConfig().serverUrl, {
      reconnection: false,
    });
    this.guessCount = 0;
    this.possibleWords = wordList;
    this.gameDifficulty = gameDifficulty;
    this.socketClient = socketClient;
    this.socketClient.once("winning", () => {
      clearTimeout(this.guessTimer);
    });
    this.guessTimer = setTimeout(
      () => this.emitGuess("ocean"),
      this.randomDelay()
    );
  }

  private randomDelay(): number {
    switch (this.gameDifficulty) {
      case GameDifficulty.EASY:
        return Math.floor(Math.random() * 20000) + 20000;
      case GameDifficulty.MEDIUM:
        return Math.floor(Math.random() * 20000) + 15000;
      case GameDifficulty.HARD:
        return Math.floor(Math.random() * 20000) + 10000;
    }
  }

  private chooseWordFromWordList(): string {
    return this.possibleWords[
      Math.floor(Math.random() * this.possibleWords.length)
    ];
  }

  private filterCorrectCase(
    wordChars: string[],
    guessedResult: ValidatedCharacter[]
  ): boolean {
    for (let i = 0; i < guessedResult.length; i++) {
      const { character, validateResult } = guessedResult[i];
      if (validateResult === "correct" && wordChars[i] !== character) {
        return false;
      }
    }
    return true;
  }

  private filterPresentCase(
    word: string,
    wordChars: string[],
    guessedResult: ValidatedCharacter[]
  ): boolean {
    for (let i = 0; i < guessedResult.length; i++) {
      const { character, validateResult } = guessedResult[i];
      if (validateResult === "present") {
        // Must contain the character but not at this position
        if (!word.includes(character) || wordChars[i] === character) {
          return false;
        }
      }
    }
    return true;
  }

  private filterAbsentCase(
    wordChars: string[],
    guessedResult: ValidatedCharacter[]
  ): boolean {
    for (let i = 0; i < guessedResult.length; i++) {
      const { character, validateResult } = guessedResult[i];

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
  }

  private filterWordListByResult(guessedResult: ValidatedCharacter[]) {
    const filtered = this.possibleWords.filter((word) => {
      // Convert word to array of characters
      const wordChars = word.split("");

      // For all difficulty, filter based on correct characters
      if (!this.filterCorrectCase(wordChars, guessedResult)) {
        return false;
      }

      // For medium and hard modes, also filter based on present characters
      if (this.gameDifficulty !== GameDifficulty.EASY) {
        if (!this.filterPresentCase(word, wordChars, guessedResult)) {
          return false;
        }
      }

      // For hard mode only, also filter based on absent characters
      if (this.gameDifficulty === GameDifficulty.HARD) {
        if (!this.filterAbsentCase(wordChars, guessedResult)) {
          return false;
        }
      }

      return true;
    });

    this.possibleWords = filtered;
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
      this.randomDelay()
    );
  }

  get pcPlayerSocketClient(): SocketClient {
    return this.socketClient;
  }
}
