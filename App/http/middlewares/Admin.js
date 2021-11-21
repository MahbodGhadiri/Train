const UserModel=require("../../Models/UserModel");
module.exports= async function (req,res,next)
{
    const user = await UserModel.findOne({_id:req.user._id});
    if (!user) {return res.status(401).send({message:"خطایی رخ داد لطفا دوباره وارد اکانت خود شوید"})}

    if((user.role==="admin")||(user.role==="super admin")){next()}
    else {return res.status(404).send("یافت نشد")}
    
}
