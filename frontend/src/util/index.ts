export const envConfig = () => {
  const serverUrl =
    process.env.REACT_APP_BACKEND_URL ?? "http://localhost:4000";
  const dictionaryApi = process.env.REACT_APP_DICTIONARY_API ?? "";
  const maxWordLength = process.env.REACT_APP_MAX_WORD_LENGTH
    ? +process.env.REACT_APP_MAX_WORD_LENGTH
    : 5;
  const maxRound = process.env.REACT_APP_MAX_ROUND
    ? +process.env.REACT_APP_MAX_ROUND
    : 6;

  return { serverUrl, dictionaryApi, maxWordLength, maxRound };
};

export const checkWordExist = async (word: string): Promise<boolean> => {
  const response = await fetch(`${envConfig().dictionaryApi}${word}`);
  return response.status === 200;
};
