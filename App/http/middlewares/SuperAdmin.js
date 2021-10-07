const UserModel=require("../../Models/UserModel")
module.exports= function (res,req,next){

    
    if(req.body.token.role==="super admin")
    {
        const user = UserModel.findOne(req.user._id);
        if(!user)
        {
            return res.status(404).send({message:"یافت نشد"})
            
        }
        if(user.role!=="super admin")
        {
            return res.status(404).send({message:"یافت نشد"})
        }
        next()
    }
    else {return res.status(404).send({message:"یافت نشد"})}
    
}