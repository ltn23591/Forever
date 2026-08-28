import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  }

  async addProduct(body: any, files: { [key: string]: Express.Multer.File[] }) {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = body;

    const image1 = files.image1 && files.image1[0];
    const image2 = files.image2 && files.image2[0];
    const image3 = files.image3 && files.image3[0];
    const image4 = files.image4 && files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined && item !== null,
    );

    const imageUrls = await Promise.all(
      images.map(async (item) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            },
          );
          uploadStream.end(item.buffer);
        });
      }),
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true',
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      image: imageUrls,
      date: Date.now(),
    };

    const product = new this.productModel(productData);
    await product.save();

    return {
      success: true,
      msg: 'Product Added',
    };
  }

  async listProducts() {
    const products = await this.productModel.find({});
    return {
      success: true,
      products,
    };
  }

  async removeProduct(id: string) {
    await this.productModel.findByIdAndDelete(id);
    return {
      success: true,
      msg: 'Product Removed',
    };
  }

  async getProduct(id: string) {
    const product = await this.productModel.findById(id);
    return {
      success: true,
      product,
    };
  }
}
