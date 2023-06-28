import { model, Schema, Types } from "mongoose";

import { User } from "./User.mode";

const tokensSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Token = model("token", tokensSchema);
