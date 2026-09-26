import { Router } from 'express';
import { userController } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.post('/register', (req, res, next) => userController.register(req, res, next));
userRouter.post('/login', (req, res, next) => userController.login(req, res, next));
userRouter.post('/admin', (req, res, next) => userController.adminLogin(req, res, next));

export default userRouter;
