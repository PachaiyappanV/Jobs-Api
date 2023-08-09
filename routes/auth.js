const express=require('express');
const router=express.Router();
const auth=require('../middleware/authentication');
const tempUser=require('../middleware/tempUser');
const rateLimiter=require('express-rate-limit')

const apiLimiter=rateLimiter({
    windowMs:15*60*1000,
    max:10,
    message:{
        msg:'Too Many Requests From This IP Please Try After Sometime',
    }
})

const {register,login,updateUser}=require('../controllers/auth');

router.post('/register',apiLimiter,register);
router.post('/login',apiLimiter,login);
router.patch('/updateUser',auth,tempUser,updateUser);


module.exports=router;
