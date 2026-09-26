import { Router } from 'express';
import { cartController } from '../../controllers/cart.controller';
import { authUser } from '../../middleware/auth.middleware';

const cartRouter = Router();

cartRouter.post('/add', authUser, (req, res, next) => cartController.addToCart(req, res, next));
cartRouter.post('/update', authUser, (req, res, next) => cartController.updateCart(req, res, next));
cartRouter.post('/get', authUser, (req, res, next) => cartController.getCart(req, res, next));

export default cartRouter;
