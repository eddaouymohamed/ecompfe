import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { createCheckoutSesssion, sendAPIKey, verfiyPayment } from '../controller/paymentController.js';
const router = express.Router();
router.route('/create-checkout-session').post(verifyUserAuth, createCheckoutSesssion)
router.route('/getkey').get(verifyUserAuth, sendAPIKey)
router.route('/payment/verification').post(verfiyPayment);
export default router
// router.post("/create-checkout-session", verifyUserAuth, ...)ordpay