import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  private validateInput(userId: string, itemId: string, size: string, quantity?: number) {
    if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
      return 'Invalid userId or itemId';
    }
    if (!size || typeof size !== 'string' || size.trim() === '') {
      return 'Size is required and must be a non-empty string';
    }
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      return 'Quantity must be a non-negative integer';
    }
    return null;
  }

  async addToCart(userId: string, itemId: string, size: string) {
    const error = this.validateInput(userId, itemId, size);
    if (error) {
      return { success: false, msg: error };
    }

    const product = await this.productModel.findById(itemId);
    if (!product) {
      return { success: false, msg: 'Product not found' };
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, msg: 'User not found' };
    }

    const cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { cartData } },
      { new: true },
    );

    return { success: true, msg: 'Added to cart' };
  }

  async updateCart(userId: string, itemId: string, size: string, quantity: number) {
    const error = this.validateInput(userId, itemId, size, quantity);
    if (error) {
      return { success: false, msg: error };
    }

    const product = await this.productModel.findById(itemId);
    if (!product) {
      return { success: false, msg: 'Product not found' };
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, msg: 'User not found' };
    }

    const cartData = user.cartData || {};
    if (!cartData[itemId] || !cartData[itemId][size]) {
      return {
        success: false,
        msg: `Item ${itemId} with size ${size} not found in cart`,
      };
    }

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { cartData } },
      { new: true },
    );

    return { success: true, msg: 'Cart updated' };
  }

  async getCart(userId: string) {
    if (!isValidObjectId(userId)) {
      return { success: false, msg: 'Invalid userId' };
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, msg: 'User not found' };
    }

    return { success: true, cartData: user.cartData || {} };
  }
}
