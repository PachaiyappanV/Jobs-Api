const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors/index');
const mongoose=require('mongoose');
const moment=require('moment');

//getting all jobs
const getAllJobs=async(req,res)=>{

    const{search,status,jobType,sort}=req.query;
    const queryObject={createdBy:req.user._id};

    if(search){
        queryObject.position={$regex:search,$options:'i'};
    }
    if(status&&status!='all'){

        queryObject.status=status;
    }
    if(jobType&&jobType!='all'){
        queryObject.jobType=jobType;
    }
console.log(queryObject)
    let result=Job.find(queryObject);

    //sorting 
    if(sort==='latest'){
        result=result.sort('-createdAt');
    }
    if(sort==='oldest'){
        result=result.sort('createdAt');
    }
    if(sort==='a-z'){
        result=result.sort('position');
    }
    if(sort==='z-a'){
        result=result.sort('-position');
    }

//pagination
const page=Number(req.query.page)||1;
const limit=Number(req.query.limit)||10;
const skip=(page-1)*limit;

result=result.skip(skip).limit(limit);

const jobs=await result;
const totalJobs=await Job.countDocuments(queryObject);
const numOfPages=Math.ceil(totalJobs/limit);



    
    res.status(StatusCodes.OK).json({jobs,totalJobs,numOfPages});
    
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
    const job=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});

}

//deletinf job
const deleteJob=async (req,res)=>{
    
    const{
        params:{id:jobId},
        user:{_id:userId}
        }=req;
     
        const job=await Job.findByIdAndDelete({_id:jobId,createdBy:userId});

        if(!job){
            throw new NotFoundError(`No job with id ${jobId}`);
        }
        res.status(StatusCodes.OK).json({job});


}

//states

const showStats=async (req,res)=>{

    let stats=await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user._id)}},
        {$group:{_id:'$status',count:{$sum:1}}},
    ]);
    //refactoring the stats object

    stats=stats.reduce((acc,curr)=>{
        const{_id:title,count}=curr;
        acc[title]=count;
        return acc;

    },{})
    //default stats

    const defaultStats={
        pending:stats.pending||0,
        interview:stats.interview||0,
        declined:stats.declined||0,
    };

    //monthly applications
    let monthlyApplications=await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user._id)}},
        {$group:{
            _id:{year:{$year:'$createdAt'},month:{$month:'$createdAt'}},count:{$sum:1}
        }},
        {$sort:{'_id.year':-1,'_id.month':-1}},
        {$limit:6},
        
    ]);

    //refactoring monthly applications
     monthlyApplications=monthlyApplications
     .map((item)=>{
        const{_id:{year,month},count}=item;

        const date=moment()
                   .month(month-1)
                   .year(year)
                   .format('MMM Y');
         return {date,count}          
    }).reverse();
    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications});

}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    showStats,
};