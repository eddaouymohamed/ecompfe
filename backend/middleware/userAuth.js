// userAuth.js
import ErrorHandling from "../utils/errorHandling.js";
import handleAsyncErrors from "./handleAsyncErrors.js";
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
// import { use } from "react";
const jwtSecretKey=process.env.JWT_SECRET_KEY ||"any"
export const verifyUserAuth = handleAsyncErrors(async (req, _res, next) => {

    const token = req.cookies.token;

    console.log("TOKEN COOKIE =>", token);

    let message;

    if (!token) {
        message = 'Authentication denied ! please login to access resource';
        return next(new ErrorHandling(message, 401));
    }

    // ✅ decode AFTER checking token
    const decodedData = jwt.verify(token, jwtSecretKey);

    console.log("Decoded Data :", decodedData);

    const user = await User.findById(decodedData.id);

    console.log("USER FOUND :", user);

    if (!user) {
        message = "user not Found";
        return next(new ErrorHandling(message, 404));
    }

    req.user = user;
    next();
});
export const roleBasedAccess=(...roles)=>{
    return (req,_res,next)=>{
        if (!roles.includes(req.user.role)) {
            const message=`Role: ${req.user.role} is not allowed to access ressource`;
            return next (ErrorHandling(message,403));
        }
        next() // can be upadetproducts deleteproducts getAllProducts getSingleproduct
    }
}
// roles='admin'