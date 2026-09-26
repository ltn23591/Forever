import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  items: any[];
  amount: number;
  address: Record<string, any>;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: { type: Array, required: true } as any,
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
});

export const OrderModel = mongoose.models.order || mongoose.model<IOrder>('order', OrderSchema);
