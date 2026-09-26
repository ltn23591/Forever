import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { ResponseHelper } from '../utils/ResponseHelper';

export class CartController {
  async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const { itemId, size } = req.body;
      const result = await cartService.addToCart(userId, itemId, size);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const { itemId, size, quantity } = req.body;
      const result = await cartService.updateCart(userId, itemId, size, Number(quantity));
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const result = await cartService.getCart(userId);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }
}

export const cartController = new CartController();
