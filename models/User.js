const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Provide Name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please Provide email'],
        match:[ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6,
    }
});

//pre

userSchema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

//instance methods

userSchema.methods.createJWT=function(){

    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});

}

userSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}
module.exports=mongoose.model('User',userSchema);