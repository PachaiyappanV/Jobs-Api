const express=require('express');
const router=express.Router();
const tempUser=require('../middleware/tempUser');

const {getAllJobs,
       getJob,
       createJob,
       deleteJob,
       updateJob,
       showStats,}=require('../controllers/jobs');

 router.route('/').get(getAllJobs).post(createJob);
 router.route('/stats').get(showStats);
 router.route('/:id').get(getJob).delete(tempUser,deleteJob).patch(tempUser,updateJob);
 
 module.exports=router;