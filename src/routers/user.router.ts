import {Router} from "express";

import {userController} from "../controllers/user.controller";
import {commonMiddleware, authMiddleware} from "../middlewares";
import {UserValidator} from "../validators";


const router = Router();

router.get("/", userController.findAll);

router.get("/:userId", commonMiddleware.isIdValid('userId'),
    authMiddleware.checkAccessToken,
    userController.findById);
router.put("/:userId", commonMiddleware.isBodyValid(UserValidator.update),
    commonMiddleware.isIdValid('userId'),
    authMiddleware.checkAccessToken,
    userController.updateById);
router.delete("/:userId", commonMiddleware.isIdValid('userId'),
    authMiddleware.checkAccessToken,
    userController.deleteById);

export const userRouter = router;


