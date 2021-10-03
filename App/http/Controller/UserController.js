const pinModel = require( "../../Models/PinModel");
const userModel = require("../../Models/UserModel");
const _ = require("lodash")
const {deleteAccountValidator , setCustomTaskValidator , changeInfoValidator} = require("../Validators/UserValidators");
const argon2=require("argon2");
const { refreshTokenModel } = require("../../Models/TokenModel");

class UserController
{
  async getProfile(req,res) //Done
  {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).send({message:"یافت نشد"});
    res.status(200).send(_.pick(user,["name","email.address","phone.number","ability","role","avatarURL"]));
  }

  async logout(req,res) //Done
  {
    await refreshTokenModel.deleteOne({_id:req.cookies.refreshToken._id});
    res.cookie("refreshToken","",{expires: new Date(0)});
    res.cookie("accessToken","",{expires: new Date(0)});
    res.status(200).send({message:"خروچ انجام شد"})

  }

  async deleteAccount(req,res) //Mostly Done
  {
    const {error}=deleteAccountValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};

    const user = await userModel.findById(req.user._id); 
    if (!user) return res.status(404).send({message:"یافت نشد"})

    if(await argon2.verify(user.password,req.body.password,{
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2})
      )
    {
      await refreshTokenModel.deleteOne({_id:req.cookies.refreshToken._id});
      res.cookie("refreshToken","",{expires: new Date(0)});
      res.cookie("accessToken","",{expires: new Date(0)});
      user.remove().then(res.status(200).send({message:"اکانت شما با موفقیت حذف شد"}));
    }
  }

  async changeInfo(req,res) //TODO Test it
  {
    const { error } = registerValidator(req.body);
    if (error) { return res.status(400).send({ message: error.message }) };

    user = await userModel.findOne({_id:req.user._id})
    user.phone.number=req.body.phoneNumber;
    user.name = req.body.name;
    user.avatarURL = req.body.avatarURL;
    user.ability = req.body.ability;
    user.save()
    res.status(200).send({message:"انجام شد"})
  }

  async changePassword(req,res) //Done
  {
    const {error} = changePasswordValidator(req.body);
    if(error){return res.status(400).send({message:error.message})}

    
    const user = await userModel.findById(req.user._id)
    if(!user)
    {
      return res.status(404)
    }
    
    if(await argon2.verify(user.password,req.body.oldPassword,config.argon2_options))
    {
      user.password =  await argon2.hash(req.body.newPassword,{
        "type": argon2.argon2id,
        "memoryCost": 15360,
        "timeCost": 2
      });
     
      await user.save();
      const refreshToken=user.generateRefreshToken(req.cookie.refreshToken)
      const accessToken=user.generateAccessToken();
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
      res.status(200).send({message:"رمز با موفقیت تغییر یافت"});
    }
    else{res.status(400).send({message:"رمز نامعتبر است"})}
  }
  
  async getTasks(req,res) //TODO Test it
  {
    const tasks = await AdminTaskModel.findMany({executors:req.user._id,done:false,failed:false})
    if(!task) return res.status(200).send({message:"فعالیتی وجود ندارد"})
    res.status(200).send({message:"با موفقیت انجام شد","tasks":tasks}).json();
  }

  async doneTask(req,res) //TODO Test it
  {
    const task = await AdminTaskModel.findById(req.query.task) ; //TODO callback
    if(task.executors.includes(req.user.id))
    {
      task.done = true;
      await task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}))
    }
    else return res.status(403).send({message:"شما اجازه این کار را ندارید"}) //TODO better messages
  }

  async delayTask(req,res) //TODO Test it
  {
    const task = await AdminTaskModel.findById(req.query.task) ; //TODO callback
    if(task.executors.includes(req.user.id))
    {
      task.delayed = true;
      await task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}))
    }
    else return res.status(403).send({message:"شما اجازه این کار را ندارید"}) //TODO better messages
  }

  async getCustomTasks(req,res) //Done
  {
    const user = await userModel
    .findById(req.user._id);
    if (!user) return res.status(404).send("یافت نشد")
    res.status(200).send(user.customTasks);
  }

  async setCustomTask(req,res) //Done
  {
    const {error}=setCustomTaskValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};
   
    if(req.body.finishDate>req.body.startDate)
    {
      const user = await userModel.findOne({_id:req.user._id})
      if(!user) {return res.status(404).send({message:"یافت نشد"})}
     
      user.customTasks.push(req.body);
      await user.save();
      res.status(200).send(user.customTasks[user.customTasks.length-1]);
    }
    else return res.status(400).send({messgae:"Invalid Date"})
  }

  async editCustomTask(req,res) //Done
  {
    const {error}=setCustomTaskValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};

    if(req.body.finishDate>req.body.startDate)
    {
      const user=await userModel
      .findOneAndUpdate(
      {_id:req.user._id,"customTasks._id":req.query.task},
      {$set : {"customTasks.$":req.body}},
      {new: true}
      )
      if (!user){return res.status(404).send({message:"یافت نشد"})};
      res.status(200).send(user.customTasks);  
    }
    else return res.status(400).send({messgae:"Invalid Date"})
  }

  async doneCustomTask(req,res) //Done
  {
    const task = await userModel.findOneAndUpdate(
      {_id:req.user._id,"customTasks._id":req.query.task},
      {$set : {"customTasks.$.done":true}},
      {new: true}
      ).exec(function(error){
      if(error) return res.status(400).send({message:"عملیات ناموفق"})
      else return res.status(200).send({message:"باموفقیت انجام شد"})
    })
  }

  async deleteCustomTask(req,res) //Done
  {
    await userModel
    .updateOne(
      {_id:req.user._id}, //?is query working //! code injection attack
      {$pull: {"customTasks":{"_id":req.query.task}}}
    ).exec(function(error){
      if(error) return res.status(400).send({message:"عملیات ناموفق"})
      else return res.status(200).send({message:"باموفقیت انجام شد"})
    })

  }

  async getPins(req,res) //Done
  {
    const pins = await pinModel.find({});
    if (!pins)
    {
      return res.status(404).send({message:"پینی یافت نشد"});
    }
    res.status(200).send(pins);
  }
}

module.exports = new UserController;