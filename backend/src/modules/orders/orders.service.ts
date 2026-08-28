import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { User } from '../users/schemas/user.schema';
import Stripe from 'stripe';

const currency = 'inr';
const deliveryCharge = 10;

@Injectable()
export class OrdersService implements OnModuleInit {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  onModuleInit() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

    const newOrder = new this.orderModel(orderData);
    await newOrder.save();
    await this.userModel.findByIdAndUpdate(userId, { cartData: {} });

    return {
      success: true,
      msg: 'Order Placed',
    };
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

    const newOrder = new this.orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await this.stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    return {
      success: true,
      session_url: session.url,
    };
  }

  async verifyStripe(orderId: string, success: string, userId: string) {
    if (success === 'true') {
      await this.orderModel.findByIdAndUpdate(orderId, { payment: true });
      await this.userModel.findByIdAndUpdate(userId, { cartData: {} });
      return { success: true };
    } else {
      await this.orderModel.findByIdAndDelete(orderId);
      return { success: false };
    }
  }

  async placeOrderRazorpay() {
    return { success: true, msg: 'Razorpay method placeholder' };
  }

  async allOrders() {
    const orders = await this.orderModel.find({});
    return {
      success: true,
      orders,
    };
  }

  async userOrders(userId: string) {
    const orders = await this.orderModel.find({ userId });
    return {
      success: true,
      orders,
    };
  }

  async updateStatus(orderId: string, status: string) {
    await this.orderModel.findByIdAndUpdate(orderId, { status });
    return {
      success: true,
      message: 'Status Updated',
    };
  }
}
