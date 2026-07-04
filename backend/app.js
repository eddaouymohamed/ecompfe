
import cors from 'cors';

import express from 'express';
import errorHandlerMidlleware from './middleware/error.js'
import products from './routes/productsRoutes.js';
import user from "./routes/userRoutes.js"
import order from './routes/orderRoutes.js';
// import payment from './routes/paymentRoutes.js';
import payment from './routes/paymentRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


if(process.env.NODE_ENV!=='PRODUCTION'){
dotenv.config({ path: 'backend/config/config.env' })
}
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const app = express()
app.use(express.json({ limit: '30mb' })) //pase jspn dtata into object
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser());
app.use(fileUpload())

//route
app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)

app.use(cors({
  origin: "http://localhost:5173", // ton frontend
  credentials: true
}));
//serve static files
app.use(express.static(path.join(__dirname,'../frontend/dist')));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandlerMidlleware)

export default app;
