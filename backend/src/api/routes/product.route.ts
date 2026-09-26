import { Router } from 'express';
import { productController } from '../../controllers/product.controller';
import { adminAuth } from '../../middleware/auth.middleware';
import { uploadProductImages } from '../../middleware/upload.middleware';

const productRouter = Router();

productRouter.post('/add', adminAuth, uploadProductImages, (req, res, next) => productController.addProduct(req, res, next));
productRouter.post('/remove', adminAuth, (req, res, next) => productController.removeProduct(req, res, next));
productRouter.post('/single', (req, res, next) => productController.getProduct(req, res, next));
productRouter.get('/list', (req, res, next) => productController.listProducts(req, res, next));

export default productRouter;
