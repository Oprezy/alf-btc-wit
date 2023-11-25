import { Router } from "express";
import { userController } from "../controllers/user.controller";

const userRouter = Router();

// // FRONTEND ROUTES
userRouter.get('/', userController.getAllUsers);
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);


export default userRouter;  