import { Controller, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { UserAuthGuard } from '../../common/guards/user-auth.guard';

@Controller('api/order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('list')
  @UseGuards(AdminAuthGuard)
  async allOrders() {
    try {
      return await this.ordersService.allOrders();
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('status')
  @UseGuards(AdminAuthGuard)
  async updateStatus(@Body('orderId') orderId: string, @Body('status') status: string) {
    try {
      return await this.ordersService.updateStatus(orderId, status);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('place')
  @UseGuards(UserAuthGuard)
  async placeOrder(
    @Req() req: any,
    @Body('items') items: any[],
    @Body('amount') amount: number,
    @Body('address') address: any,
  ) {
    try {
      const userId = req.user.userId;
      return await this.ordersService.placeOrder(userId, items, amount, address);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('stripe')
  @UseGuards(UserAuthGuard)
  async placeOrderStripe(
    @Req() req: any,
    @Body('items') items: any[],
    @Body('amount') amount: number,
    @Body('address') address: any,
    @Headers('origin') origin: string,
  ) {
    try {
      const userId = req.user.userId;
      return await this.ordersService.placeOrderStripe(userId, items, amount, address, origin);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('razorpay')
  @UseGuards(UserAuthGuard)
  async placeOrderRazorpay() {
    try {
      return await this.ordersService.placeOrderRazorpay();
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('userorders')
  @UseGuards(UserAuthGuard)
  async userOrders(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.ordersService.userOrders(userId);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('verifyStripe')
  @UseGuards(UserAuthGuard)
  async verifyStripe(
    @Req() req: any,
    @Body('orderId') orderId: string,
    @Body('success') success: string,
  ) {
    try {
      const userId = req.user.userId;
      return await this.ordersService.verifyStripe(orderId, success, userId);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
