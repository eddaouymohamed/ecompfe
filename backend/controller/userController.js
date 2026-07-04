import handleAsyncErrors from "../middleware/handleAsyncErrors.js";
import crypto from 'crypto'
import User from "../models/userModel.js";
import ErrorHandling from "../utils/errorHandling.js";
import sendToken from '../utils/jwtToken.js'
import { sendMail } from "../utils/sendMail.js";
import { v2 as cloudinary } from 'cloudinary';

/// register user
export const registerUser = handleAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    const existingUser = await User.findOne({ email });
    let message;
    if (!name || !email || !password || !avatar) {
        message = 'please fill out all required fields';
        return next(new ErrorHandling(message, 400))
    }
    if (existingUser) {
        message = `user with email ${email} already exists please Login instead`;
        return next(new ErrorHandling(message, 400));
    }
    try {
    //     const myCloud = await cloudinary.uploader.upload(avatar, {
    //         folder: 'avatars',
    //         width: 150,
    //         crop: 'scale',
    //     })
        // 
        console.log("Avatar reçu :", avatar);

const myCloud = await cloudinary.uploader.upload(avatar,{
    folder:"avatars",
    width:150,
    crop:"scale"
});

// console.log(myCloud);
console.log("Cloudinary Result:   ", myCloud);
        // 

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }

        })
        sendToken(user, 201, res)
    }
    //  catch (error) {
    //     if (error.http_code === 400) {
    //         return next(new ErrorHandling('Invalid image format', 400))
    //     }
    //     return next(new ErrorHandling('Error Registration User', 500));


    // }
    catch (error) {
    console.error("REGISTER ERROR:", error);
    return next(new ErrorHandling(error.message, 500));
}


})
///login USER
export const loginUser = handleAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    let message = '';
    if (!(email && password)) {
        message = 'email or passwor cannot be empty'
        return next(new ErrorHandling(message, 400))
    }
    const user = await User.findOne({ email }).select('+password');

    // we use slect method to include the pasword in the result(user) because it seted seect to
    // fasle in useShema see userModel.js
    message = 'Invalid email or password '
    if (!user) {
        return next(new ErrorHandling(message, 401))
    }
    // const isPasswordMatch=await user.comparePassword(password);
    // or using verifyPassword method insde usermodel.js
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
        return next(new ErrorHandling(message, 401))
    }
    sendToken(user, 201, res)

})
export const logoutUser = handleAsyncErrors(async (_req, res, _next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httponly: true
    })
    res.status(200).json({
        success: true,
        message: "successfuly logged out"
    })

})
// forgot password

export const requestPasswordReset = handleAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let message;

    if (!user) {
        message = 'user not found ';
        return next(new ErrorHandling(message, 400));
    }

    let resetToken;
    try {
        // Génération du token (Attention à l'orthographe "generatePawordResetToken" provenant de ton modèle)
        resetToken = user.generatePawordResetToken();
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        message = `could not save reset token please try again later `;
        return next(new ErrorHandling(message, 500));
    }

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const resetPasswordMsg = `please following this url ${resetPasswordUrl} to reset password \n\n this link will be expired in 5 minutes \n\n if you didn't request a link please ignore this message easily`;

    try {
        console.log('protocol is:', req.protocol);
        console.log('host is:', req.get('host'));
        console.log('reset token is:', resetToken);

        // ✅ CORRECTION : Ajout de "await" pour attendre la fin de l'envoi de l'e-mail
        // await 
        
        sendMail({
            email: user.email,
            subject: 'Request Password Reset Link',
            resetPasswordMsg
        });

        // La réponse de succès n'est envoyée QUE si l'e-mail est réellement parti
        res.status(200).json({
            success: true,
            message: `mail successfully sent to ${user.email}`
        });

    } catch (error) {
        console.error("Erreur d'envoi SMTP attrapée :", error);
        message = `couldn't send email to ${user.email} please try again later `;
        
        // Nettoyage de sécurité en base de données si l'envoi SMTP échoue
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(new ErrorHandling(message, 500));
    }
});
//reset password
export const resetPassword = handleAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }

    })
    let message;
    if (!user) {
        message = 'reset password token is invalid or has  been expired'
        return next(new ErrorHandling(message, 400))
    }
    const { password, confirmPassword } = req.body;
    if (confirmPassword !== password) {
        message = 'password does not match'
        return next(new ErrorHandling(message, 400))

    }
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save()
    sendToken(user, 200, res)
})
//get user deatils

export const getUserDetails = handleAsyncErrors(async (req, res, _next) => {
    const user = await User.findById(req.user.id).select('-password'); //exluding password for not
    // appearing in res if (selct not settting to false in User model)
    res.status(200).json({
        success: true,
        user
    })
})
// update Password
export const updatePassword = handleAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const matchPassword = await user.verifyPassword(oldPassword);
    let message;
    if (!matchPassword) {
        message = 'Invalid Old password';
        return next(new ErrorHandling(message, 400))
    }
    if (newPassword !== confirmPassword) {
        message = 'password does not match';
        return next(new ErrorHandling(message, 400))
    }
    user.password = newPassword;
    await user.save()
    sendToken(user, 200, res);
})
// update profile
export const updateProfile = handleAsyncErrors(async (req, res, next) => {
    const { name, email, avatar } = req.body;
    const updateUserDetails = {
        name,
        email,
        updatedAt: Date.now()
    }
    if (avatar) {
        const user = await User.findById(req.user._id);
        const imageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId)
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })
        updateUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateUserDetails, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "profile updated successfulLy",
    })
})
// we will going go work on admin authorization
//
// get users list
export const getUsersList = handleAsyncErrors(async (_req, res, _next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})
// ADMIN -get single user
export const getSingleUser = handleAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    let message;
    if (!user) {
        message = `there is no user match the id :${userId}`;
        return next(new ErrorHandling(message, 400));

    }
    res.status(200).json({
        success: true,
        user

    })

})

// admin -change user role
export const updateUserRole = handleAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const { role } = req.body;
    const newData = {
        role
    }
    const user = await User.findByIdAndUpdate(userId, newData, {
        new: true,
        runValidators: true
    })
    let message;
    if (!user) {
        message = `there is no user much the id :${userId}`;
        return next(new ErrorHandling(message, 400))

    }
    res.status(200).json({
        success: true,
        message: 'user role updated successfully'
    })



})
// admin delete user profile
export const deleteUser = handleAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    let message;
    if (!user) {
        message = `there is no user match the id :${userId}`
        return next(new ErrorHandling(message, 404));
    }
    await cloudinary.uploader.destroy(user.avatar.public_id)
    await User.findByIdAndDelete(userId)
    res.status(200).json({
        success: true,
        message: 'user deleted successfully'
    })
})
//