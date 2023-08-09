const mongoose=require('mongoose');

const JobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Company name must be given'],
        maxlength:50,
    },
    position:{
        type:String,
        required:[true,'position must be given'],
        maxlength:100,
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'User must be given'],

    },
    jobType:{
        type:String,
        enum:['full-time','part-time','remote','internship'],
        default:'full-time',

    },
    jobLocation:{
        type:String,
        default:'my city',
        required:true,
    },

},{timestamps:true})


module.exports=mongoose.model('Job',JobSchema);