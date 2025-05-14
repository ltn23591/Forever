import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, requied: true },
    items: { type: Array, requied: true },
    amount: { type: Number, requied: true },
    address: { type: Object, requied: true },
    status: { type: String, requied: true, default: 'Order Placed' },
    paymentMethod: { type: String, requied: true },
    payment: { type: Boolean, requied: true, default: false },
    date: { type: Number, requied: true },
});

const OrderModel = mongoose.model.order || mongoose.model('order', orderSchema);

export default OrderModel;
