import { NextFunction, Request, Response } from "express";

import { avatarConfig } from "../configs/file.config";
import { ApiError } from "../errors";

class FileMiddleware {
  public isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.files.avatar);
      // const id = req.params[field];
      //
      if (Array.isArray(req.files.avatar)) {
        throw new ApiError(`Avatar must be 1 file`, 400);
      }

      const { mimetype, size } = req.files.avatar;

      if (!avatarConfig.MIMETYPES.includes(mimetype)) {
        throw new ApiError(`Avatar has invalid format`, 400);
      }

      if (size > avatarConfig.MAX_SIZE) {
        throw new ApiError(`Avatar is too big`, 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
