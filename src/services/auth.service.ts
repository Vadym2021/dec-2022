import { Types } from "mongoose";

import { EActionTokenTypes } from "../enums/action-token-type.enum";
import { EEmailActions } from "../enums/email.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { ApiError } from "../errors";
import { Action } from "../models/Action.model";
import { OldPassword } from "../models/OldPassword.model";
import { Token } from "../models/Token.model";
import { User } from "../models/User.mode";
import { ICredentials, ITokenPayload, ITokensPair } from "../types/token.types";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(data.password);

      const user = await User.create({ ...data, password: hashedPassword });

      const actionToken = tokenService.generateActionToken(
        { _id: user._id },
        EActionTokenTypes.Activate
      );
      await Promise.all([
        Action.create({
          actionToken,
          tokenType: EActionTokenTypes.Activate,
          _userId: user._id,
        }),
        emailService.sendMail(data.email, EEmailActions.WELCOME, {
          name: data.name,
          actionToken,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activate(jwtPayload: ITokenPayload): Promise<void> {
    try {
      await Promise.all([
        User.updateOne({ _id: jwtPayload._id }, { status: EUserStatus.Active }),
        Action.deleteMany({
          _userId: jwtPayload._id,
          tokenType: EActionTokenTypes.Activate,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokensPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      const tokensPair = await tokenService.generateTokenPair({
        _id: user._id,
        name: user.name,
      });

      await Token.create({
        ...tokensPair,
        _userId: user._id,
      });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    oldTokensPair: ITokensPair,
    tokenPayload: ITokenPayload
  ): Promise<ITokensPair> {
    try {
      const tokensPair = await tokenService.generateTokenPair(tokenPayload);

      await Promise.all([
        Token.create({ _userId: tokenPayload._id, ...tokensPair }),
        Token.deleteOne({ refreshToken: oldTokensPair.refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    dto: { newPassword: string; oldPassword: string },
    userId: string
  ): Promise<void> {
    try {
      const oldPasswords = await OldPassword.find({ _userId: userId });
      await Promise.all(
        oldPasswords.map(async ({ password: hash }) => {
          const isMatched = await passwordService.compare(
            dto.oldPassword,
            hash
          );
          if (isMatched) {
            throw new ApiError("Wrong old password", 400);
          }
        })
      );

      const user = await User.findById(userId).select("password");

      const isMatched = await passwordService.compare(
        dto.oldPassword,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("Wrong old password", 400);
      }

      const newHash = await passwordService.hash(dto.newPassword);
      await Promise.all([
        OldPassword.create({ password: user.password, _userId: userId }),
        User.updateOne({ _id: userId }, { password: newHash }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async forgotPassword(
    userId: Types.ObjectId,
    email: string
  ): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        { _id: userId },
        EActionTokenTypes.Forgot
      );
      await Promise.all([
        Action.create({
          actionToken,
          tokenType: EActionTokenTypes.Forgot,
          _userId: userId,
        }),
        emailService.sendMail(email, EEmailActions.FORGOT_PASSWORD, {
          actionToken,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async setForgotPassword(
    password: string,
    userId: Types.ObjectId,
    actionToken: string
  ): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(password);
      await Promise.all([
        User.updateOne({ _id: userId }, { password: hashedPassword }),
        Action.deleteOne({ actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
