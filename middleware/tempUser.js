const {BadRequestError}=require('../errors/index');

const tempUser=(req,res,next)=>{
    if(req.tempUser){
        throw new BadRequestError('Tast User Read Only');
    }
    next();
}

module.exports=tempUser;