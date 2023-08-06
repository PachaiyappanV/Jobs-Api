const jwt=require('jsonwebtoken');
const User=require('../models/User');
const {UnauthenticatedError}=require('../errors/index');

const auth=async (req,res,next)=>{

    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token=authHeader.split(' ')[1]
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);

        const user= await User.findById(payload.userId).select('-password');
        req.user=user;
        
        // req.user={id:payload.userId,name:payload.name}
        next();
     }
     catch(error){
        throw new UnauthenticatedError('Authentication invalid');
     }
}

module.exports=auth;