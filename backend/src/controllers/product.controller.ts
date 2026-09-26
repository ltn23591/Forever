import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { ResponseHelper } from '../utils/ResponseHelper';

export class ProductController {
  async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      const result = await productService.addProduct(req.body, files);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async removeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;
      const result = await productService.removeProduct(id);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.body;
      const result = await productService.getProduct(productId);
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }

  async listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.listProducts();
      res.json(result);
    } catch (error: any) {
      res.json(ResponseHelper.error(error.message));
    }
  }
}

export const productController = new ProductController();
