const jwt = require("jsonwebtoken");
const config = require('../../../config/default.json');
const userModel = require("../../Models/UserModel")
require("cookie-parser");

module.exports = async function (req,res,next)
{
    var refreshToken= req.cookies.refreshToken;
    var accessToken = req.cookies.accessToken;
    var userData;
    if (!accessToken)
    {
        refreshToken = req.cookies.refreshToken;
       if (!refreshToken)
       {
           return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});
       }
       try
       {
         userData = jwt.verify(refreshToken,config.secretKey);
       }
       catch{return res.status(401).send({message:"invalid credentials"})}
      
    
       let user = await userModel.findOne({_id:userData._id});
     
       if(!user)
       {return res.status(401).send({message:"لطفا وارد اکانت خود شوید"})}

       if(user.password===userData.password)
       {
            const data = 
            {
                _id:user._id,
                password:user.password,
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
            req.user=data;
            next();
       }

   }
    try
     {
    userData = jwt.verify(accessToken,config.secretKey);
    }
     catch{console.log("this");return res.status(401).send({message:"invalid credentials"})}
    req.user=userData;
    console.log(req.body);
    next();

}