import {Request, Response, NextFunction} from "express";
import {ApiError} from "../errors";
import {Token} from "../models/Token.model";
import { tokenService } from "../services/token.service";
// import {User} from "../models/User.mode";
// import {IUser} from "../types/user.type";


class AuthMiddleware {
    public async checkAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            const accessToken = req.get('Authorization');

            if (!accessToken) {
                throw new ApiError('No token', 401)
            }

            const payload = tokenService.checkToken(accessToken);

            const entity = await Token.findOne({accessToken: accessToken});
            if (!entity) {
                throw new ApiError('Token not valid', 409);
            }
            req.res.locals.tokenPayload = payload;
            next();
        } catch (e) {
            next(e)
        }
    }
}

export const authMiddleware = new AuthMiddleware();
