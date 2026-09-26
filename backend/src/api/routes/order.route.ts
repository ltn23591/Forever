import { Router } from 'express';
import { orderController } from '../../controllers/order.controller';
import { adminAuth, authUser } from '../../middleware/auth.middleware';

const orderRouter = Router();

// Admin features
orderRouter.post('/list', adminAuth, (req, res, next) => orderController.allOrders(req, res, next));
orderRouter.post('/status', adminAuth, (req, res, next) => orderController.updateStatus(req, res, next));

// User features
orderRouter.post('/place', authUser, (req, res, next) => orderController.placeOrder(req, res, next));
orderRouter.post('/stripe', authUser, (req, res, next) => orderController.placeOrderStripe(req, res, next));
orderRouter.post('/razorpay', authUser, (req, res, next) => orderController.placeOrderRazorpay(req, res, next));
orderRouter.post('/userorders', authUser, (req, res, next) => orderController.userOrders(req, res, next));
orderRouter.post('/verifyStripe', authUser, (req, res, next) => orderController.verifyStripe(req, res, next));

export default orderRouter;
