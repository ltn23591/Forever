import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserAuthGuard } from '../../common/guards/user-auth.guard';

@Controller('api/cart')
@UseGuards(UserAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Req() req: any, @Body('itemId') itemId: string, @Body('size') size: string) {
    try {
      const userId = req.user.userId;
      return await this.cartService.addToCart(userId, itemId, size);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('update')
  async updateCart(
    @Req() req: any,
    @Body('itemId') itemId: string,
    @Body('size') size: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      const userId = req.user.userId;
      return await this.cartService.updateCart(userId, itemId, size, quantity);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('get')
  async getCart(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.cartService.getCart(userId);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }
}
