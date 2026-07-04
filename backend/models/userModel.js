import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcryptjs from "bcrypt"
import jwt from 'jsonwebtoken'
import crypto from 'crypto' ;
const {isEmail}=validator
const jwtSecretKey=process.env.JWT_SECRET_KEY || "any";
const jwtExpiredIn=process.env.JWT_EXPIRED_IN ||'3d';
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxLength:[25,"Invalid name.Please enter a valid name with fewer than 25 characters"],
        minLength:[5,"name should contain more than 5 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[isEmail,"please enter a valid email address"]
    },
    password: {
        type:String,
        required:true,
        minLength:[8,"password should contain at least 8 characters"],
        select:false, 

    },
    avatar:{
        public_id:{
            type:String,
            required:true

        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},{timestamps:true});
userSchema.pre('save', async function (next){
    // just if password modified will hashing the password
    if(!this.isModified("password")){
        return next();
    }
    try {
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);

    }

})
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},jwtSecretKey,{
        expiresIn:jwtExpiredIn
    })
}
userSchema.methods.verifyPassword=async function (enterdPassword) {
    return  bcryptjs.compare(enterdPassword,this.password)

}
    //forgot and reset password
userSchema.methods.generatePawordResetToken=function () {
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+5*60*1000 // after 5 minutes
    return resetToken;
}
export default mongoose.model('User',userSchema);


