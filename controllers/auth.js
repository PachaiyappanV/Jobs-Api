const User=require('../models/User');
const {BadRequestError,UnauthenticatedError}=require('../errors/index');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs')
const register=async (req,res)=>{
   const user=await User.create(req.body);
   const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({
    user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location:user.location,
        token}});
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
    res.status(StatusCodes.OK).json({
        user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location:user.location,
        token}});
}

const updateUser=async (req,res)=>{
    const{name,lastName,email,location}=req.body;

    if(!name||!lastName||!email||!location){
        throw new BadRequestError('Please provide all fields');
    }

    const user=await User.findOne({_id:req.user._id});

    user.email=email;                      //we can do like this to update user
    user.lastName=lastName;
    user.name=name;
    user.location=location;
    await user.save();
    const token=user.createJWT();
    res.status(StatusCodes.OK).json({
        user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location:user.location,
        token}});

}

module.exports={
    register,
    login,
    updateUser,
};