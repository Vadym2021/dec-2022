import { removeOldPasswords } from "./remove-old-passwords";
import { removeOldTokens } from "./remove-old-tokens.cron";

export const cronRunner = () => {
  removeOldTokens.start();
  removeOldPasswords.start();
};
