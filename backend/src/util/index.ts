import fs from "fs";

export const loadWordsFromJSON = (dictionarFilePath: string): string[] => {
  const data = fs.readFileSync(dictionarFilePath, "utf-8");
  const jsonData = JSON.parse(data);
  return jsonData.words;
};

export const pickRandomWordFromList = (wordlist: string[]): string => {
  const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)];
  return randomWord;
};
