import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  image: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ type: [String], required: true })
  sizes: string[];

  @Prop({ type: Boolean })
  bestseller: boolean;

  @Prop({ required: true })
  date: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
