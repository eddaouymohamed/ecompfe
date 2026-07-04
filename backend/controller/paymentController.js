import { stripe } from "../server.js";
import handleAsyncErrors from "../middleware/handleAsyncErrors.js";
import { sendMail } from "../utils/sendMail.js";

export const sendAPIKey = handleAsyncErrors(async (req, res) => {
    const stripePublishedKey = process.env.STRIPE_PUBLISHED_KEY
    res.status(200).json({
        success: true,
        stripePublishedKey
    })
})
export const createCheckoutSesssion = handleAsyncErrors(async (req, res) => {
    try {
        console.log(" CREATE CHECKOUT SESSION HIT");
        console.log("BODY =>", req.body);
        console.log("CLIENT URL =>", process.env.CLIENT_URL);

        const { amount, shippingInfo, user } = req.body;

        if (!amount) {
            throw new Error("Amount is missing");
        }

        if (!shippingInfo) {
            throw new Error("Shipping info is missing");
        }

        if (!user) {
            throw new Error("User is missing");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'mad',
                        unit_amount: Math.round(amount * 100),
                        product_data: {
                            name: 'general product',
                            description: 'general description || thanks for purchase'
                        }
                    },
                    quantity: 1
                }
            ],
            customer_email: user.email,
            metadata: {
                buyer_name: user.name,
                phone: shippingInfo.phoneNumber
            },
            success_url: `${process.env.CLIENT_URLp}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URLp}/payment/cancel`
        });

        // Fixed: Removed the stray "server" text that was written here

        console.log("✅ STRIPE SESSION CREATED =>", session.id);

        return res.status(200).json({
            success: true,
            id: session.id,
            session,
            url: session.url
        });

    } catch (error) {
        console.log("❌ STRIPE ERROR =>", error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
});
export const verfiyPayment = handleAsyncErrors(async (req, res) => {
    const { session_id } = req.body
    if (!session_id || typeof (session_id) !== 'string') {
        res.status(400).json({
            success: false,
            message: 'A valid session id is required'
        })
        return;
    }
    // retrieve session from stripe
    const session=await stripe.checkout.sessions.retrieve(session_id);
    /// check payment status
    if (session.payment_status==='paid') {
        // crate and save order model
        // sedn mail notification to user
        //
        const orderSuccessMessage=`thank for your order!\n Total Paid:${session.amount_total}\n we will get started on fulfillment shortly`
        let emailSent;
       try {
         sendMail({
            email: session.customer_email,
            subject: 'Your Order Confirmation',
            orderSuccessMessage

        })
        emailSent=true
       } catch (error) {
        emailSent=false;

       }
        res.status(200).json({
            success:true,
            message:'payment verfied successfully',
            emailSent
        })
        return;

    } else {
        // payent not comleted
        res.status(402).json({
            success:false,
            message:'payment is not completed or still pending'
        })


    }

})