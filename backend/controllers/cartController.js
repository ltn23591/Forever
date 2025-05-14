import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js'; // Giả sử có mô hình sản phẩm
import { isValidObjectId } from 'mongoose';

// Validate input
const validateInput = ({ userId, itemId, size, quantity }) => {
    if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
        return 'Invalid userId or itemId';
    }
    if (!size || typeof size !== 'string' || size.trim() === '') {
        return 'Size is required and must be a non-empty string';
    }
    if (
        quantity !== undefined &&
        (!Number.isInteger(quantity) || quantity < 0)
    ) {
        return 'Quantity must be a non-negative integer';
    }
    return null;
};

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user.userId; // Lấy từ middleware authUser

        // Validate input
        const validationError = validateInput({ userId, itemId, size });
        if (validationError) {
            return res
                .status(400)
                .json({ success: false, msg: validationError });
        }

        // Check if product exists
        const product = await productModel.findById(itemId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, msg: 'Product not found' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: 'User not found' });
        }

        const cartData = user.cartData || {};
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(
            userId,
            { $set: { cartData } },
            { new: true },
        );
        res.status(200).json({ success: true, msg: 'Added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Update cart
const updateToCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.userId;

        // Validate input
        const validationError = validateInput({
            userId,
            itemId,
            size,
            quantity,
        });
        if (validationError) {
            return res
                .status(400)
                .json({ success: false, msg: validationError });
        }

        // Check if product exists
        const product = await productModel.findById(itemId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, msg: 'Product not found' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: 'User not found' });
        }

        const cartData = user.cartData || {};
        if (!cartData[itemId] || !cartData[itemId][size]) {
            return res.status(400).json({
                success: false,
                msg: `Item ${itemId} with size ${size} not found in cart`,
            });
        }

        if (quantity === 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(
            userId,
            { $set: { cartData } },
            { new: true },
        );
        res.status(200).json({ success: true, msg: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Get user cart data
const getToCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!isValidObjectId(userId)) {
            return res
                .status(400)
                .json({ success: false, msg: 'Invalid userId' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: 'User not found' });
        }

        res.status(200).json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

export { addToCart, updateToCart, getToCart };
