const UserModel=require("../../Models/UserModel")
module.exports= function (res,req,next){

    
    if(req.body.token.role==="super admin")
    {
        const user = UserModel.findOne(req.body.token._id);
        if(!user)
        {
            return res.status(401).send({message:"خطایی در تایید هویت اکانت شما رخ داد ، مجددا وارد اکانت خود شوید"})
            //! come up with better error message
        }
        if(user.role!=="super admin")
        {
            return res.status(403).send({message:"شما به این صفحه دسترسی ندارید"})
        }
        next()
    }
    else {return res.status(401).send("شما سطح دسترسی لازم را ندارید")}
    
}