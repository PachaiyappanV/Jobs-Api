const User=require('../models/User');
const {BadRequestError,UnauthenticatedError}=require('../errors/index');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs')
const register=async (req,res)=>{
   const user=await User.create(req.body);
   const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
}

const login=async (req,res)=>{
    const{email,password}=req.body;
    if(!email || !password){
        throw new BadRequestError('Password and Email must be given');
    }
    const user=await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect=await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }
    const token=user.createJWT();
    res.status(StatusCodes.OK).json({name:user.name,token});
}

module.exports={
    register,
    login,
};