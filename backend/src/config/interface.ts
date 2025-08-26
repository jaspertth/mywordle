export interface EnvironmentVariables {
  port: number;
  dictionaryFilePath: string;
  maxWordLength: number;
  maxRound: number;
  requriedPlayers: number;
  pcPlayerJoinDelayMs: number;
  serverUrl: string;
  maxDisconnectionDuration: number;
  corsOrigin: string | RegExp;
}
