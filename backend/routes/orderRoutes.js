


import express from "express";
import {
    allMyOrders,
    createNewOrder,
    deleteOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus
} from "../controller/orderController.js";

import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Create order
router.route("/new/order").post(verifyUserAuth, createNewOrder);

// Get single order
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);

// Admin order actions
router
    .route("/admin/order/:id")
    .get(verifyUserAuth, roleBasedAccess("admin"), getSingleOrder)
    .put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus)
    .delete(verifyUserAuth, roleBasedAccess("admin"), deleteOrder);

// Get user orders
router.route("/orders/user").get(verifyUserAuth, allMyOrders);

// Get all orders (admin)
router.route("/admin/orders").get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);

export default router;