import app from "./app.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
import { connectMongoDb } from "./config/db.js";
import { v2 as cloudinary } from 'cloudinary';

if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: 'backend/config/config.env' })
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
try {
    const result = await cloudinary.api.ping();
    console.log(result);
} catch (err) {
    console.log(err);
}
connectMongoDb();

const port = process.env.PORT || 3000;
export const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY)
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`)

})
console.log(process.env.STRIPE_API_SECRET_KEY)
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`)
    console.log('server is shutting down due to uncaught exception errors')
    process.exit(1)
})

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log('server is shutting down due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})