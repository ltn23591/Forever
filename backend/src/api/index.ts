import { Router } from 'express';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';
import cartRouter from './routes/cart.route';
import orderRouter from './routes/order.route';

const apiRoutes = Router();

apiRoutes.use('/user', userRouter);
apiRoutes.use('/product', productRouter);
apiRoutes.use('/cart', cartRouter);
apiRoutes.use('/order', orderRouter);

export default apiRoutes;
