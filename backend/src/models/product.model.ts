import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
  date: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

export const ProductModel = mongoose.models.product || mongoose.model<IProduct>('product', ProductSchema);
