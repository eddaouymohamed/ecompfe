// error.js
import ErrorHandling from "../utils/errorHandling.js";

export default (err,req,res,next)=>{  // err instance of ErrorHandling
    if(err.name==='CastError'){
        const message=`this is invalid resource ${err.path}` // err.path ex:id:htpp:any"/"-__"_"çé
        err=new ErrorHandling(message,404)
    }
    if(err.code===11000){
        const message =`the ${ Object.keys(err.keyValue)} already exists please sign in to continue `;
        
        err=new ErrorHandling(message,400)
    }
    const message=err.message || 'Internal Server Error'
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:message
    })
}