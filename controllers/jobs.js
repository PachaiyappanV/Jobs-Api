const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors/index');

//getting all jobs
const getAllJobs=async(req,res)=>{
    const jobs=await Job.find({createdBy:req.user._id}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
    
}

//getting single job
const getJob=async(req,res)=>{
    const{
        params:{id:jobId},
        user:{_id:userId} }=req;
    const job=await Job.findOne({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
}

//cretaing the job
const createJob=async(req,res)=>{
    
    req.body.createdBy=req.user._id;
    const job=await Job.create(req.body);
    res.status(StatusCodes.OK).json({job});
}

//updating the job
const updateJob=async(req,res)=>{

    const{
    body:{company,position},
    params:{id:jobId},
    user:{_id:userId}
    }=req;
    if(!company || !position){
        throw new BadRequestError('company or positions fields cannot be empty')
    }
    const updatedJob=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});

    if(!updatedJob){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({updatedJob});

}

const deleteJob=async (req,res)=>{
    
    const{
        params:{id:jobId},
        user:{_id:userId}
        }=req;
     
        const deletedJob=await Job.findByIdAndDelete({_id:jobId,createdBy:userId});

        if(!deletedJob){
            throw new NotFoundError(`No job with id ${jobId}`);
        }
        res.status(StatusCodes.OK).json({deletedJob});


}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};