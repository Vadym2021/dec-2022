import { config } from "dotenv";
import * as process from "process";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  SECRET_SALT:process.env.SECRET_SALT,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  NO_REPLY_EMAIL:process.env.NO_REPLY_EMAIL,
  NO_REPLY_PASSWORD:process.env.NO_REPLY_PASSWORD,
 };
