import { ProductModel } from '../models/product.model';
import { cloudinary } from '../config/cloudinary.config';
import { ResponseHelper } from '../utils/ResponseHelper';

export class ProductService {
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

    const image1 = files?.image1 && files.image1[0];
    const image2 = files?.image2 && files.image2[0];
    const image3 = files?.image3 && files.image3[0];
    const image4 = files?.image4 && files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined && item !== null
    );

    const imageUrls = await Promise.all(
      images.map(async (item) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || '');
            }
          );
          uploadStream.end(item.buffer);
        });
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      image: imageUrls,
      date: Date.now(),
    };

    const product = new ProductModel(productData);
    await product.save();

    return ResponseHelper.success(product, 'Product Added', { msg: 'Product Added' });
  }

  async listProducts() {
    const products = await ProductModel.find({});
    return ResponseHelper.success(products, 'Product list fetched', { products });
  }

  async removeProduct(id: string) {
    await ProductModel.findByIdAndDelete(id);
    return ResponseHelper.success(null, 'Product Removed', { msg: 'Product Removed' });
  }

  async getProduct(id: string) {
    const product = await ProductModel.findById(id);
    return ResponseHelper.success(product, 'Product fetched', { product });
  }
}

export const productService = new ProductService();
