import { config } from "dotenv";
import * as process from "process";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET,
  JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,

  FRONT_URL: process.env.FRONT_URL,

  SECRET_SALT: process.env.SECRET_SALT,

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_NAME: process.env.AWS_S3_NAME,
  AWS_S3_ACL: process.env.AWS_S3_ACL,
  AWS_S3_URL: process.env.AWS_S3_URL,

  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_TOKEN: process.env.TWILIO_TOKEN,
};
