import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { ProductModel } from '../models/product.model';
import { ResponseHelper } from '../utils/ResponseHelper';

export class CartService {
  private validateInput(userId: string, itemId: string, size: string, quantity?: number) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
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
      return ResponseHelper.error(error, 'INVALID_INPUT', 400);
    }

    const product = await ProductModel.findById(itemId);
    if (!product) {
      return ResponseHelper.error('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return ResponseHelper.error('User not found', 'USER_NOT_FOUND', 404);
    }

    const cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    await UserModel.findByIdAndUpdate(userId, { $set: { cartData } }, { new: true });
    return ResponseHelper.success(cartData, 'Added to cart', { msg: 'Added to cart' });
  }

  async updateCart(userId: string, itemId: string, size: string, quantity: number) {
    const error = this.validateInput(userId, itemId, size, quantity);
    if (error) {
      return ResponseHelper.error(error, 'INVALID_INPUT', 400);
    }

    const product = await ProductModel.findById(itemId);
    if (!product) {
      return ResponseHelper.error('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return ResponseHelper.error('User not found', 'USER_NOT_FOUND', 404);
    }

    const cartData = user.cartData || {};
    if (!cartData[itemId] || !cartData[itemId][size]) {
      return ResponseHelper.error(`Item ${itemId} with size ${size} not found in cart`, 'ITEM_NOT_IN_CART', 400);
    }

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await UserModel.findByIdAndUpdate(userId, { $set: { cartData } }, { new: true });
    return ResponseHelper.success(cartData, 'Cart updated', { msg: 'Cart updated' });
  }

  async getCart(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ResponseHelper.error('Invalid userId', 'INVALID_USER_ID', 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return ResponseHelper.error('User not found', 'USER_NOT_FOUND', 404);
    }

    return ResponseHelper.success(user.cartData || {}, 'Cart fetched', { cartData: user.cartData || {} });
  }
}

export const cartService = new CartService();
