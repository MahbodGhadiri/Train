const nodemailer = require ("nodemailer");
const crypto = require("crypto");
const userModel = require("../../Models/UserModel");

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "testmailfortestpurposes",
      pass: "oHt76%98&YF",
    },
  });

module.exports= async function sendConfirmationEmail(userId) 
{
    
    let mailOptions = {};
  
    user= await userModel.findOne({_id:userId});
    if(user.email.active===true){return}
    const emailVerificationToken = crypto.randomBytes(16).toString("hex");
    user.email.verificationToken = emailVerificationToken;
    await user.save();

      mailOptions = {
        from: "Train <testmailfortestpurposes>",
        to: user.email.address,
        subject: "Confirm your account",
        html: `<div>
        <form action="" style=" width: 100%;
      background: transparent;
      border: 1px solid #6E85b2;
      margin: 6px 0;
      height: 60px;
      border-radius: 10px;
      padding: 0 10px;
      box-sizing: border-box;
      outline: none;
      text-align: center;
      color: #ffffff;
      background-color: rgb(23, 111, 184);
      font-size: 30px;">تایید حساب کاربری</form>
        <p style=" font-size: 20px;" align="right" dir="rtl"> سلام،${user.name} <br>لطفا برای تایید حساب کاربری بر روی دکمه ی زیر کلیک کنید.</p>
       <a href="http://localhost:3000/api/user/verify_email/${user._id}/${emailVerificationToken}"><button dir="rtl" style="  width: 20%;
      background: rgb(23, 111, 184);
      margin: 0 0 0 80%;
      height: 30px;
      font-size: 18px;
      padding: 0 10px;
      box-sizing: border-box;
      outline: none;
      color: #fff;
      cursor: pointer;
      text-align: center;
      position: right;">تایید لینک</button></a>
    
        <p style=" font-size: 20px;"  align="right" dir="rtl">از شما متشکریم
        </p>
    
    
    
    
    
    
    
    
    
    </div>`,
      };
      
    
    transport.sendMail(mailOptions, function (error, response) {
      if (error && error != null) {
        console.log(error);
        return error.response;
      }
    });
}