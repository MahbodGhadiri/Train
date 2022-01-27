const { registerValidator, loginValidator , forgotPasswordUsingEmailValidator , resetPasswordValidator } = require("../Validators/AuthValidators");
const userModel = require("../../Models/UserModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const sendEmail = require("../Helper/sendMail");
const {forgotPasswordModel} = require("../../Models/TokenModel");
const crypto = require("crypto");

class AuthController {

  async  register(req, res)
  {
    req.body.email = req.body.email.toLocaleLowerCase();
    
    const { error } = registerValidator(req.body);
    if (error) { return res.status(400).send({ message: error.message }) }
    for (const field in req.body) {
      if (field != "password") {
        req.body[field] = _.trim(req.body[field]);
      }
      if (field === "ability"){
        for (const item in req.body.ability){
          if (!(item in this.allAbilities)) 
            return res.status(400).send(`توایی با عنوان"${item} وجود ندارد!`)
        }
      }
    }
    
    let user = await userModel.findOne(
      { $or: [{ "email.address": req.body.email }, { "phone.number": req.body.phoneNumber }] }
    )
    if (user) { return res.status(400).send({message:"کاربری با این اطلاعات وجود دارد!"}) }

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
    await user.save();
    
    sendEmail(user._id);
  
    res.status(200).send({message:" عملیات با موفقیت انجام شد . جهت فعالسازی به ایمیل خود مراجعه کنید.",_id:user._id});
  }

  async  login(req, res)
  {
    const { error } = loginValidator(req.body);
    if (error) { return res.status(400).send({ message: error.message }) }

    const user = await userModel.findOne({ "email.address": req.body.email });
    if (!user) { return res.status(400).send({message:"رمز یا نام کاربری نامعتبر است"}) }

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
          sameSite:"Strict",
          secure:true
        })
        .status(200).send({message:"ورود با موفقیت انجام شد",role:user.role});
      }
      else
      {
        return res.status(401).send({message:"اکانت شما فعال نشده است!",activeEmail:user.email.active,activeAccount:user.activeAccount})
      }
      
    }
    else{res.status(400).send({message:"رمز یا نام کاربری نامعتبر است!"})};
    }

  async resendActivationEmail(req,res)
  {
    const user = await userModel.findByOne({_id:{$eq:req.query.userId}});
    if(!user)
    {
      return res.status(400).send({message:"کاربر وجود ندارد یا اکانت قبلا فعال شده است"});
    }
    if(user.email.active)
    {
      return res.status(400).send({message:"کاربر وجود ندارد یا اکانت قبلا فعال شده است"});
    }
    sendEmail(req.body.userId);
    res.status(200).send({message:"ایمیل ارسال شد"})
  }

  async activateEmail(req,res) //required params : userId and sendedVerficationToken(created in register API)
  { 
    const {userId , sendedVerificationToken}=req.params;
    
    if(!userId || !sendedVerificationToken){return res.status(400).send({message:"لینک نامعتبر است"})}
       
    const user = await userModel.findOne({_id:userId});
    if(!user){return res.status(400).send({message:"لینک نامعتبر است"})}

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
    else{return res.send(400).send({message:"لینک نامعتبر است"})}
  }

  async forgotPassword(req,res) //TODO Add reset with phonenumber option
  {
    if(req.body.email)
    {
      req.body.email = req.body.email.trim().toLocaleLowerCase();
      const {error} = forgotPasswordUsingEmailValidator(req.body.email);
      if (error) 
      {
        res.status(400).send({message:`خطایی رخ داد! اطمینان حاصل کنید که ایمیل شما به درستی وارد شده باشد. \n ${error} `})
      }
      const user = await userModel.findOne({"email.address":req.body.email});
      //Check if account is activated
      if (user.activeAccount===true)
      {
        // generate token for login 
        const verificationToken = crypto.randomBytes(16).toString("hex");
        // generate link with valid format , link must have user._id and a valid token
        const loginLink = `${process.env.domain}/api/auth/forgot-password/login/${user._id}/${verificationToken}`;
        //remove any previously existing login token from DB
        //? may there be a bug that cause saving two Tokens in DB?
        let tokenInfo = await forgotPasswordModel.findOne({_id:user._id});
        if(tokenInfo)
        {
          await tokenInfo.remove();
        }
        // save token to DB //? Do tokens have expiration date? if not add expiration
        const data = 
        {
          _id:user._id,
          token:verificationToken,
        }
        tokenInfo = await new forgotPasswordModel(data);
        await tokenInfo.save();
        // send mail to user Email , the link will redirect user to get forgotPassword/login
        sendEmail(user._id , loginLink);
        res.status(200).send({message:"به ایمیل خود مراجعه کرده و از آنجا مراحل را ادامه دهید"});
      }
      else { res.status(404).send({message:"با این ایمیل اکانت معتبری وجود ندارد"})}
      
    }
    else if (req.body.phoneNumber)
    {
      //TODO reset password with Phone Number!!!
      res.status(503) //Just to avoid getting stuck
    }
    else
    {
      res.status(400).send("وارد کردن ایمیل یا شماره تلفن الزامی است")
    }
  }
  
  async forgotPasswordLogin(req, res) //need co op with frontend //required params : userId & Token (created in forgotPassword Method)
  {
    const { userId, sendedVerificationToken } = req.params;
    
    if (!userId || !sendedVerificationToken)
      return res.status(400).send({ message: "لینک نامعتبر" });
    //checking if token is valid
    const tokenInfo = await forgotPasswordModel.findById(userId);
    if(!tokenInfo)
      return res.status(400).send({message:"لینک نامعتبر"});
    if(tokenInfo.token===sendedVerificationToken)
    {
      const user = await userModel.findById(userId);
      if(!user)
       return res.status(404).send({message:"لینک نامعتبر"});
      //api won't delete the token as it is needed when changing password
      //generating refreshToken to log the user in
      const token = await user.generateRefreshToken();
      res.cookie("refreshToken",token,{
        httpOnly:true,
        maxAge:4*60*60*1000,
        sameSite:"strict",
        //secure:true //TODO uncomment when deployed
      }).status(200).redirect(`${process.env.Domain}/reset-password?userId=${userId}&token=${sendedVerificationToken}`);
    }
    else { res.status(400).send({message:"لینک نامعتبر"});}
  }

  async resetPassword(req,res) //looks fine , needs to be checked for bugs
  {
    const { error } = resetPasswordValidator(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const userId = req.query.userId;
    const sendedVerificationToken = req.query.token;
    if (!userId || !sendedVerificationToken)
      return res.status(400).send({ message: "لینک نامعتبر" })
    const user = await userModel.findById(userId);
    if (!user || req.user._id.toString() != userId)
      return res.status(400).send({ message: "لینک نامعتبر" });
    const tokenInfo = await forgotPasswordModel.findById(userId);
    if (!tokenInfo)
      return res.status(400).send({ message: "لینک نامعتبر" })
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
      user.email.createdAt=undefined;
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
      res.status(200).send({message:"رمز با موفقیت تغییر یافت",role:user.role}) 
    } else return res.status(400).send({ message: "Invalid Request" });
  }

  static allAbilities = ["برنامه نویسی","گرافیک","مدیریت","دیگر","مدیریت مالی"];
}

module.exports = new AuthController;
