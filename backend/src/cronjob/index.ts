import cron from "node-cron";
import { envConfig } from "../config";

/**
 * Creates and returns a cron job that sends a keep-alive request to the server
 * @returns The configured cron job
 */
export const createKeepAliveCron = () => {
  const keepAliveTask = cron.schedule(
    "*/10 * * * *",
    async () => {
      const serverUrl = envConfig().serverUrl;
      await fetch(serverUrl);
    },
    { scheduled: false }
  );
  return keepAliveTask;
};
