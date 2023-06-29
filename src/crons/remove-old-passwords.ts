import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { oldPassword } from "../models/OldPassword.model";

dayjs.extend(utc);

const oldPasswordsRemover = async () => {
  const previousYear = dayjs().utc().subtract(1, "year");
  console.log(previousYear.toISOString());

  await oldPassword.deleteMany({
    createdAt: { $lte: previousYear },
  });
};

export const removeOldPasswords = new CronJob(
  "0 0 0  * * *",
  oldPasswordsRemover,
  null,
  true
);
