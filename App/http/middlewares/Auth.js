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
        
        if ((!refreshToken)||(!refreshToken._id))
        {
            
            return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});
        }
        //try
        //{
            userData = jwt.verify(refreshToken._id,config.secretKey);
        //}
        //catch{return res.status(401).send({message:"invalid credentials"})}
      
        let user = await userModel.findOne({_id:userData._id});
        if(!user) {return res.status(401).send({message:"لطفا وارد اکانت خود شوید"})}
        refreshToken = await user.generateRefreshToken(refreshToken)
        if (refreshToken===null) {return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});}

        accessToken = await user.generateAccessToken()
            
        res.cookie("accessToken",accessToken,
            {
                httpOnly:true,
                maxAge:8*60*1000,
                sameSite:"strict",
                //secure:true
            }
        )
        res.cookie("refreshToken",refreshToken,
            {
                httpOnly:true,
                maxAge:8*60*1000,
                sameSite:"strict",
                //secure:true
            }
        )
        req.user=user.getEssentialData(); 
        next();
    }
    else
    {
        try
        {
            userData = jwt.verify(accessToken,config.secretKey);
        }
        catch{return res.status(401).send({message:"invalid credentials"})}
        req.user=userData;
        next();
    }
}