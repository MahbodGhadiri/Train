const jwt = require("jsonwebtoken");
const userModel = require("../../Models/UserModel")
require("cookie-parser");

module.exports = async function (req,res,next)
{
    var refreshToken= req.cookies.refreshToken;
    var accessToken = req.cookies.accessToken;
    var userData;
    //Cheking if accessToken Exist
    if (!accessToken)
    {   //There is no accessToken, Cheking if a refreshToken Exist 
        if (!refreshToken) 
            //There is no refreshToken, so login is needed
            return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});
        //There is a refreshToken, Checking if its signature valid    
        try
        {
            userData = jwt.verify(refreshToken,process.env.secretKey);
        }
        catch{return res.status(401).send({message:"invalid credentials"});}
        //signature is valid, Cheking if user _id is valid
        let user = await userModel.findOne({_id:userData._id});
        if(!user) 
            return res.status(401).send({message:"لطفا وارد اکانت خود شوید"})
        // //rotating refreshToken
        // refreshToken = await user.generateRefreshToken(refreshToken)
        // if (refreshToken===null) {return res.status(401).send({message:"لطفا وارد اکانت خود شوید"});}
        //generating accessToken
        accessToken = await user.generateAccessToken()
        res.cookie("accessToken",accessToken,
            {
                httpOnly:true,
                maxAge:10*60*1000,
                sameSite:"strict",
                //secure:true
            }
        )
        res.cookie("refreshToken",refreshToken,
            {
                httpOnly:true,
                maxAge:4*60*60*1000,
                sameSite:"strict",
                //secure:true
            }
        )
        //saving in req.user important userData for further use in APIs
        userData = jwt.verify(accessToken,process.env.secretKey);
        req.user=userData;
        next();
    }
    else
    {
        //accessToken Exist, cheking if its valid
        try
        {
            userData = jwt.verify(accessToken,process.env.secretKey);
        }
        catch{return res.status(401).send({message:"invalid credentials"})}
        req.user=userData;
        next();
    }
}