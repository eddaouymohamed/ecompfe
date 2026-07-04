
import handleAsyncErrors from "../middleware/handleAsyncErrors.js";
import ErrorHandling from "../utils/errorHandling.js";
import Order from "../models/orderModel.js";
import Product from "../models/productsmodel.js";

// CREATE NEW ORDER
export const createNewOrder = handleAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});

// GET SINGLE ORDER
export const getSingleOrder = handleAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandling("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// USER ORDERS
export const allMyOrders = handleAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});

// ADMIN ALL ORDERS
export const getAllOrders = handleAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

// UPDATE STATUS
export const updateOrderStatus = handleAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandling("Order not found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandling("Order already delivered", 400));
    }

    const { status } = req.body;

    if (status === "Delivered") {
        await Promise.all(
            order.orderItems.map(item =>
                updateQuantity(item.product, item.quantity)
            )
        );

        order.deliveredAt = Date.now();
    }

    order.orderStatus = status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order,
        message: "Order updated successfully"
    });
});

// UPDATE STOCK
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// DELETE ORDER
export const deleteOrder = handleAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandling("Order not found", 404));
    }

    if (order.orderStatus !== "Delivered") {
        return next(new ErrorHandling("Cannot delete processing order", 400));
    }

    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});