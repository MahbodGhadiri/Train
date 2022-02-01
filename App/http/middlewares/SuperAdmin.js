const UserModel=require("../../Models/UserModel")
module.exports=async function (req,res,next)
{
    if(req.user.role==="super admin")
    {
        const user = await UserModel.findOne({_id:req.user._id});
        if(!user)
           return res.status(404).send({message:"یافت نشد"}) 
        if(user.role!=="super admin")
            return res.status(404).send({message:"یافت نشد"})
        if(user.activeAccount)
            next()
        else return res.status(403).send({message:"امکان پذیر نمی باشد!"})
    }
    else {return res.status(404).send({message:"یافت نشد"})} 
}