import {ApiError} from "../errors";
import {Token} from "../models/Token.model";
import {User} from "../models/User.mode";
import {ICredentials, ITokensPair} from "../types/token.types";
import {IUser} from "../types/user.type";
import {passwordService} from "./password.service";
import {tokenService} from "./token.service";

class AuthService {
    public async register(data: IUser): Promise<void> {
        try {
            const hashedPassword = await passwordService.hash(data.password);

            await User.create({...data, password: hashedPassword})
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async login(credantials: ICredentials, user: IUser): Promise<ITokensPair> {
        try {
            user = await User.findOne({email:credantials.email}).select("password");
            const isMatched = await passwordService.compare(credantials.password, user.password);
            if (!isMatched) {
                new ApiError('inavalid email or password', 401)
            }
            const tokensPair = await tokenService.generateTokenPair({_id: user._id});

            await Token.create({...tokensPair, _userId: user._id});
            return tokensPair;
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }

    }
}

export const authService = new AuthService();