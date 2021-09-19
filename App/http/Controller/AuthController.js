const { registerValidator, loginValidator , resetPasswordValidator } = require("../Validators/AuthValidators");
const userModel = require("../../Models/UserModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../../../config/default.json");
const {sendConfirmationEmail,sendNewpasswordEmail} = require("../Helper/sendMail");

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
    
    sendConfirmationEmail(user._id);
  
    res.status(200).send({message:" عملیات با موفقیت انجام شد . جهت فعالسازی به ایمیل خود مراجعه کنید.",_id:user._id});
  }

  async  login(req, res) {
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
        const data = {
          _id:user._id,
          password:user.password,
        }
        const token = jwt.sign(data,config.secretKey,{expiresIn:4*60*60});
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

  async resendActivationEmail(req,res) //TODO with get method
  {
    
    const user = await userModel.findById(req.body.userId);
    if(!user)
    {
      return res.status(404).send({message:"کاربری با این اطلاعات یافت نشد"});
    }
    if(user.email.active)
    {
      return res.status(400).send({message:"این ایمیل قبلا فعال شده است"});
    }
    sendConfirmationEmail(req.body.userId);
    res.status(200).send({message:"ایمیل ارسال شد"})
  }

  async activateEmail(req,res)
  { 
    const {userId , emailVerificationToken}=req.params;
        
    if(!userId || !emailVerificationToken){return res.status(400).send({message:"درخواست نامعتبر است"})}
       
    const user = await userModel.findOne({_id:userId});
    if(!user){return res.status(404).send({message:"درخواست نامعتبر است"})}

    if(user.email.verificationToken==emailVerificationToken)
    {
      user.email.active=true;
      await user.save();
      res
      .send(`<link rel="stylesheet" href="/css/styles.css"> <div align="center"><b> ایمیل شما تایید شد ، در انتظار فعال سازی اکانت شما توسط ادمین</b></div>`
      );
    }
    else{return res.send(400).send({message:"درخواست نامعتبر است"})}

  }

  async forgotPassword(req,res)
  {
    // TODO add validator
    const email = req.params;
    console.log(userEmail);
    const user = await userModel.findOne({"email.address":userEmail});
    if(!user)
    {
      return res.status(404).send({message:"اطلاعات کاربر یافت نشد"})
    }
    if(user.email.active)
    {
      sendNewpasswordEmail(user);
    }
    else{return res.status(403)}
  }
  
  async resetPassword(req,res)
  {
    const {error} = resetPasswordValidator(req.body);
    if(error){return res.status(400).send({message:error.message})}

    const user = await userModel.findById(req.body)
    if(!user)
    {
      return res.status(404)
    }
    if(await argon2.verify(user.password,req.body.oldPassword,config.argon2_options))
    {
      user.password =  await argon2.hash(newPassword,config.argon2_options);
      await user.save();
      res.status(200).send({message:"رمز با موفقیت تغییر یافت"});
    }
  }
}

module.exports = new AuthController;