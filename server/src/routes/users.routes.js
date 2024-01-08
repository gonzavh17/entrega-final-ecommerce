import { Router } from "express";
import passport from "passport";
import userController from "../controllers/userController.js";

const routerUser = Router();

routerUser.post('/register' ,userController.validateUserData, passport.authenticate('register'), userController.postUser)
routerUser.post('/password-recovery', userController.passwordRecovery)
routerUser.post('/reset-password/:token', userController.resetPassword)

export default routerUser;