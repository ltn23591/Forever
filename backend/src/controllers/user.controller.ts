import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { ResponseHelper } from '../utils/ResponseHelper';

export class UserController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.register(req.body);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.adminLogin(req.body);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }
}

export const userController = new UserController();
