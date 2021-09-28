const { registerValidator, loginValidator , forgotPasswordUsingEmailValidator , resetPasswordValidator } = require("../Validators/AuthValidators");
const userModel = require("../../Models/UserModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../../../config/default.json");
const sendEmail = require("../Helper/sendMail");
const forgotPasswordModel = require("../../Models/TokenModel");
const crypto = require("crypto");

class AuthController {

  async  register(req, res)  //Done
  {
   
    req.body.email = req.body.email.toLocaleLowerCase();
    
    const { error } = registerValidator(req.body);
    if (error) { return res.status(400).send({ message: error.message }) }
    for (const field in req.body) {
      if (field != "password") {
        req.body[field] = _.trim(req.body[field]);
      }
    }
    let user = await userModel.findOne(
      { $or: [{ "email.address": req.body.email }, { "phone.number": req.body.phoneNumber }] }
    )
    if (user) { return res.status(400).send("کاربری با این اطلاعات وجود دارد!") }

        
    const userData= 
    {
      name:req.body.name,
      password :  await argon2.hash(req.body.password,{
        type: argon2.argon2id,
        memoryCost: 15360,
        timeCost: 2,
      }),
      email: {address:req.body.email},
      phone: {number:req.body.phoneNumber},
      ability:req.body.ability
    }
    user = await new userModel(userData);
    user = await user.save();
    
    sendEmail(user._id);
  
    res.status(200).send({message:" عملیات با موفقیت انجام شد . جهت فعالسازی به ایمیل خود مراجعه کنید.",_id:user._id});
  }

  async  login(req, res) //Done
  {
    const { error } = loginValidator(req.body);
    if (error) { res.status(400).send({ message: error.message }) }

    const user = await userModel.findOne({ "email.address": req.body.email });
    if (!user) { return res.status(404).send("چنین کاربری وجود ندارد") }

         
    if(await argon2.verify(user.password,req.body.password,{
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2}))
    {
      if(user.email.active&&user.activeAccount)
      {
        
        const token = await user.generateRefreshToken();
        res.cookie("refreshToken",token,{
          httpOnly:true,
          maxAge:4*60*60*1000,
          sameSite:"strict",
          //secure:true
        })
        .status(200).send({message:"ورود با موفقیت انجام شد"});
      }
      else
      {
        return res.status(401).send({message:"اکانت شما فعال نشده است!",activeEmail:user.email.active,activeAccount:user.activeAccount})
      }
      
    }
    else{res.status(400).send({message:"رمز نامعتبر است"})};
    }

  async resendActivationEmail(req,res) //Done
  {
    const user = await userModel.findById(req.query.userId);
    if(!user)
    {
      return res.status(404).send({message:"کاربری با این اطلاعات یافت نشد"});
    }
    if(user.email.active)
    {
      return res.status(400).send({message:"این ایمیل قبلا فعال شده است"});
    }
    sendEmail(req.body.userId);
    res.status(200).send({message:"ایمیل ارسال شد"})
  }

  async activateEmail(req,res) //Done for now
  { 
    const {userId , sendedVerificationToken}=req.params;
    
    if(!userId || !sendedVerificationToken){return res.status(400).send({message:"درخواست نامعتبر است"})}
       
    const user = await userModel.findOne({_id:userId});
    if(!user){return res.status(404).send({message:"درخواست نامعتبر است"})}

    if(user.email.verificationToken==sendedVerificationToken)
    {
      user.email.active=true;
      user.email.verificationToken=undefined;
      user.email.createdAt=undefined;
      await user.save();
      res
      .send(`<link rel="stylesheet" href="/css/styles.css"> <div align="center"><b> ایمیل شما تایید شد ، در انتظار فعال سازی اکانت شما توسط ادمین</b></div>`
      );
    }
    else{return res.send(400).send({message:"درخواست نامعتبر است"})}

  }

  async forgotPassword(req,res) //Add reset with phonenumber option
  {
    if(req.body.email)
    {
      req.body.email = req.body.email.trim().toLocaleLowerCase();
      const {error} = forgotPasswordUsingEmailValidator(req.body.email);
      if (error) 
      {
        res.status(400).send(`an error occured , make sure you are using either your email or your phone number \n ${error} `)
      }
      const user = await userModel.findOne({"email.address":req.body.email});
      if (user.activeAccount===true)
      {
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const loginLink = `http://localhost:3000/api/auth/forgot-password/login/${user._id}/${verificationToken}`;
        let tokenInfo = await forgotPasswordModel.findById(user._id);
        if(tokenInfo)
        {
          await tokenInfo.remove();
        }
        const data = 
        {
          _id:user._id,
          token:verificationToken,
        }
        console.log(data);
        tokenInfo = await new forgotPasswordModel(data);
        await tokenInfo.save();
        sendEmail(user._id , loginLink);
        res.status(200).send({message:"به ایمیل خود مراجعه کرده و از آنجا مراحل را ادامه دهید"});
      }
      else { res.status(404).send({message:"با این ایمیل اکانت معتبری وجود ندارد"})}
      
    }
    else if (req.body.phoneNumber)
    {
      //TODO reset password with Phone Number!!!
    }
    else
    {
      res.status(400).send("وارد کردن ایمیل یا شماره تلفن الزامی است")
    }
  }
  
  async forgotPasswordLogin(req, res) //need co op with frontend
  {
    const { userId, sendedVerificationToken } = req.params;
    
    if (!userId || !sendedVerificationToken)
      return res.status(400).send({ message: "لینک نامعتبر" });
    const tokenInfo = await forgotPasswordModel.findById(userId);
    if(!tokenInfo)
      return res.status(400).send({message:"لینک نامعتبر"});
    if(tokenInfo.token===sendedVerificationToken)
    {
      const user = await userModel.findById(userId);
      if(!user)
       return res.status(404).send({message:"لینک نامعتبر"});
      const token = user.generateRefreshToken();
      res.cookie("refreshToken",token,{
        httpOnly:true,
        maxAge:4*60*60*1000,
        sameSite:"strict",
        //secure:true
      }).status(200).send("PasswordResetPage"); // TODO redirect to password reset page !!!
    }
    else { res.status(400).send({message:"لینک نامعتبر"});}
  }

  async resetPassword(req,res) //looks fine , needs to be checked for bugs
  {
    
    const { error } = resetPasswordValidator(req.body);
    if (error) return res.status(400).send({ message: error.message });
    const userId = req.body.path.slice(28).split("/")[0];
    const sendedVerificationToken = req.body.path.slice(28).split("/")[1];
    const user = await userModel.findById(userId);
    if (!user || !sendedVerificationToken || req.user._id.toString() != userId)
      return res.status(400).send({ message: "لینک نامعتبر" });
      
    const tokenInfo = await forgotPasswordModel.findById(userId);
    if (tokenInfo.token === sendedVerificationToken) {
      req.body.password = await argon2.hash(req.body.password, {
        type: argon2.argon2id,
        memoryCost: 15360,
        timeCost: 2,
      });
      user.password = req.body.password;
      await tokenInfo.remove();
      await refreshTokenModel.deleteOne({_id:req.cookies.refreshToken._id});
      res.cookie("refreshToken","",{expires: new Date(0)});
      res.cookie("accessToken","",{expires: new Date(0)});
      await user.save();
      const refreshToken = await user.generateRefreshToken();
      res.cookie("refreshToken",refreshToken,
        {
          httpOnly:true,
          maxAge:4*60*60*1000,
          sameSite:"strict",
          //secure:true
        }
      )
      res.status(200).send({message:"رمز با موفقیت تغییر یافت"});
    } else return res.status(400).send({ message: "Invalid Request" });

  }

}

module.exports = new AuthController;