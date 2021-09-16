const jwt = require("jsonwebtoken");
const config = require('../../../config/default.json');
const userModel = require("../../Models/UserModel")
require("cookie-parser");

module.exports = async function (req,res,next)
{
   let accessToken = req.cookies.accessToken;
   if (!accessToken)
   {
       const refreshToken = req.cookies.refreshToken;
       if (!refreshToken)
       {
           return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});
       }
       try
       {
        var userData = jwt.verify(refreshToken,config.secretKey);
       }
       catch{res.status(401).send({message:"invalid credentials"})}
      
    
       let user = await userModel.findOne({_id:userData._id});
     
       if(!user)
       {return res.status(401).send({message:"لطفا وارد اکانت خود شوید"})}

       if(user.password===userData.password)
       {
            const data = 
            {
                _id:user._id,
                password:user.password,
                role:user.role,
                active:user.active
            }
            accessToken = jwt.sign(data,config.secretKey,{expiresIn:8*60})
            res.cookie("accessToken",accessToken,
                {
                httpOnly:true,
                maxAge:8*60*1000,
                sameSite:"strict",
                //secure:true
                }
            )
            req.body.token=data;
            next();
       }

   }
    try
    {
    const userData = jwt.verify(refreshToken,config.secretKey);
    }
    catch{res.status(401).send({message:"invalid credentials"})}
    req.body.token=userData;
    next();

}