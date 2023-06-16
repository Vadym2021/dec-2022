import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.mode";
import { ICredentials, ITokensPair } from "../types/token.types";
import { IUser } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import {emailService} from "./email.service";
import { EEmailActions } from "../enums/email.enum";

class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(data.password);


      await User.create({ ...data, password: hashedPassword });
      await emailService.sendMail(data.email,EEmailActions.WELCOME,{name:data.name,});
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokensPair> {
    try {
      //TODO: remove, settle inside of the middleware
      user = await User.findOne({ email: credentials.email });

      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      const tokensPair = await tokenService.generateTokenPair({
        _id: user._id,
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
}

export const authService = new AuthService();
