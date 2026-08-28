import { Controller, Post, Get, Body, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('api/product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('add')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 },
      { name: 'image4', maxCount: 1 },
    ]),
  )
  async addProduct(
    @Body() body: any,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
  ) {
    try {
      return await this.productsService.addProduct(body, files);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('remove')
  @UseGuards(AdminAuthGuard)
  async removeProduct(@Body('id') id: string) {
    try {
      return await this.productsService.removeProduct(id);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('single')
  async getProduct(@Body('productId') productId: string) {
    try {
      return await this.productsService.getProduct(productId);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Get('list')
  async listProducts() {
    try {
      return await this.productsService.listProducts();
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }
}
