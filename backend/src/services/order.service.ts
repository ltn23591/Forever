import Stripe from 'stripe';
import { OrderModel } from '../models/order.model';
import { UserModel } from '../models/user.model';
import config from '../config';
import { ResponseHelper } from '../utils/ResponseHelper';

export class OrderService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripeSecretKey);
  }

  async placeOrder(userId: string, items: any[], amount: number, address: any) {
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    return ResponseHelper.success(newOrder, 'Order Placed', { msg: 'Order Placed' });
  }

  async placeOrderStripe(userId: string, items: any[], amount: number, address: any, origin: string) {
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: config.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: config.currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: config.deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await this.stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    return ResponseHelper.success(null, 'Stripe Checkout Created', { session_url: session.url });
  }

  async verifyStripe(orderId: string, success: string, userId: string) {
    if (success === 'true') {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      await UserModel.findByIdAndUpdate(userId, { cartData: {} });
      return ResponseHelper.success(null, 'Payment verified');
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      return ResponseHelper.error('Payment failed', 'PAYMENT_FAILED', 400);
    }
  }

  async placeOrderRazorpay() {
    return ResponseHelper.success(null, 'Razorpay method placeholder', { msg: 'Razorpay method placeholder' });
  }

  async allOrders() {
    const orders = await OrderModel.find({});
    return ResponseHelper.success(orders, 'All orders fetched', { orders });
  }

  async userOrders(userId: string) {
    const orders = await OrderModel.find({ userId });
    return ResponseHelper.success(orders, 'User orders fetched', { orders });
  }

  async updateStatus(orderId: string, status: string) {
    await OrderModel.findByIdAndUpdate(orderId, { status });
    return ResponseHelper.success(null, 'Status Updated', { message: 'Status Updated' });
  }
}

export const orderService = new OrderService();
