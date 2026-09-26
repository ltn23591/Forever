import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { ResponseHelper } from '../utils/ResponseHelper';

export class OrderController {
  async allOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.allOrders();
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, status } = req.body;
      const result = await orderService.updateStatus(orderId, status);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async placeOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const { items, amount, address } = req.body;
      const result = await orderService.placeOrder(userId, items, Number(amount), address);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async placeOrderStripe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const { items, amount, address } = req.body;
      const origin = (req.headers.origin as string) || 'http://localhost:5173';
      const result = await orderService.placeOrderStripe(userId, items, Number(amount), address, origin);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async placeOrderRazorpay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.placeOrderRazorpay();
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async userOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const result = await orderService.userOrders(userId);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async verifyStripe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body.userId;
      const { orderId, success } = req.body;
      const result = await orderService.verifyStripe(orderId, String(success), userId);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }
}

export const orderController = new OrderController();
