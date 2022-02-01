const pinModel = require( "../../Models/PinModel");
const userModel = require("../../Models/UserModel");
const {adminTaskModel,Filter} = require("../../Models/AdminTaskModel")
const _ = require("lodash")
const {deleteAccountValidator , setCustomTaskValidator , changeInfoValidator} = require("../Validators/UserValidators");
const {changePasswordValidator}=require("../Validators/AuthValidators")
const argon2=require("argon2");
const { refreshTokenModel } = require("../../Models/TokenModel");

class UserController
{
  async getProfile(req,res) 
  {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).send({message:"یافت نشد"});
    res.status(200).send(_.pick(user,["name","email.address","phone.number","ability","role","avatarURL","_id"]));
  }

  async logout(req,res) 
  {
    await refreshTokenModel.deleteMany({_id:req.cookies.refreshToken._id});
    res.cookie("refreshToken","",{expires: new Date(0)});
    res.cookie("accessToken","",{expires: new Date(0)});
    res.status(200).send({message:"خروچ انجام شد"})
  }

  async deleteAccount(req,res) 
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
      await refreshTokenModel.deleteMany({_id:req.cookies.refreshToken._id});
      res.cookie("refreshToken","",{expires: new Date(0)});
      res.cookie("accessToken","",{expires: new Date(0)});
      user.remove().then(res.status(200).send({message:"اکانت شما با موفقیت حذف شد"}));
    }
  }

  async changeInfo(req,res)
  {
    const { error } = changeInfoValidator(req.body);
    if (error) { return res.status(400).send({ message: error.message }) };

    const user = await userModel.findOne({_id:req.user._id})
    user.phone.number=req.body.phoneNumber;
    user.name = req.body.name;
    user.avatarURL = req.body.avatarURL;
    user.ability = req.body.ability;
    user.email.createdAt =undefined;
    await user.save()
    res.status(200).send({message:"انجام شد"})
  }

  async changePassword(req,res)
  {
    const {error} = changePasswordValidator(req.body);
    if(error){return res.status(400).send({message:error.message})}

    const user = await userModel.findById(req.user._id)
    if(!user) return res.status(404)
    //Cheking if password is correct
    if(await argon2.verify(user.password,req.body.oldPassword,{
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2})
    )
    {
      //hashing new password
      user.password =  await argon2.hash(req.body.newPassword,{
        "type": argon2.argon2id,
        "memoryCost": 15360,
        "timeCost": 2
      });
      //saving new password
      user.email.createdAt =undefined;
      await user.save();
      //Generating Tokens //? is it needed to remove older Tokens? or rotating tokens handle it ?
      const refreshToken=user.generateRefreshToken(req.cookie.refreshToken)
      const accessToken=user.generateAccessToken();
      res.cookie("accessToken",accessToken,
        {
          httpOnly:true,
          maxAge:10*60*1000,
          sameSite:"strict",
          //secure:true //TODO Uncomment when launched
        }
      )
      res.cookie("refreshToken",refreshToken,
        {
          httpOnly:true,
          maxAge:4*60*60*1000,
          sameSite:"strict",
          //secure:true //TODO Uncomment when launched
        }
      )
      res.status(200).send({message:"رمز با موفقیت تغییر یافت"});
    }
    else{res.status(400).send({message:"رمز نامعتبر است"})}
  }
  
  async getTasks(req,res)//optional query parameters: days , subject 
  {
    let tasks = await adminTaskModel.find({"executors._id":req.user._id,done:false,delayed:false})
    console.log(tasks);
    if (req.query.days||req.query.subject)
    {
      const filter = new Filter(tasks,req.query.days,req.query.subject);
      filter.byDays();
      filter.bySubject();
      res.status(200).send({message:"انجام شد",tasks:filter.tasks});
    }
    else res.status(200).send({message:"انجام شد",tasks:tasks});
  }

  async doneTask(req,res)//required query parameter : task(id)
  {
    const task = await adminTaskModel.findByOne({_id:{$eq:req.query.task}})
    .exec((err,task)=>
    {
      if (err) {return res.status(404).send({message:"یافت نشد"})}
      if (task)
      {
        let bool = false;
        for(let i=0; i<task.length;i++)
        {
          if (task.executors._id==req.user._id)
          {
          bool=true
          }
        }

        if(bool)
        {
          if (task.done === false)
          {
            task.done = true;
            task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}));
          }
          else return res.status(200).send({meassage:"قبلا انجام شده"});
        }
        else return res.status(403).send({message:"شما اجازه این کار را ندارید"}) //TODO better messages
      }
      else res.status(404).send({message:"یافت نشد"})
    }) ;
    
  }

  async delayTask(req,res)//required query parameter : task(id)
  {
    if(!req.query.task) return res.status(400).send("No taskId is provided") //TODO better messages
    const task = await adminTaskModel.findOne({_id:{$eq:req.query.task}}) ;
    let bool = false;
    for(let i=0; i<task.length;i++)
    {
      if (task.executors._id==req.user._id)
      {
        bool=true
      }
    }
    if(bool)
    {
      task.delayed = true;
      await task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}))
    }
    else return res.status(403).send({message:"شما اجازه این کار را ندارید"}) 
  }

  async getCustomTasks(req,res)
  {
    const user = await userModel
    .findById(req.user._id);
    if (!user) return res.status(404).send("یافت نشد")
    res.status(200).send(user.customTasks);
  }

  async setCustomTask(req,res) 
  {
    const {error}=setCustomTaskValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};
   
    const finishDate = new Date(req.body.finishDate).getTime()
    const startDate = new Date(req.body.startDate).getTime()
    if(finishDate>startDate) //TODO startDate > now
    {
      const user = await userModel.findOne({_id:req.user._id})
      if(!user) {return res.status(404).send({message:"یافت نشد"})}
     
      user.customTasks.push(req.body);
      user.email.createdAt=undefined;
      await user.save();
      res.status(200).send(user.customTasks[user.customTasks.length-1]);
    }
    else return res.status(400).send({messgae:"Invalid Date"})
  }

  async editCustomTask(req,res)
  {
    const {error}=setCustomTaskValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};

    const finishDate = new Date(req.body.finishDate).getTime()
    const startDate = new Date(req.body.startDate).getTime()
    if(finishDate>startDate) //TODO startDate > now
    {
      const user=await userModel
      .findOneAndUpdate(
      {_id:req.user._id,"customTasks._id":{$eq:req.query.task}},
      {$set : {"customTasks.$":req.body}},
      {new: true}
      )
      if (!user){return res.status(404).send({message:"یافت نشد"})};
      res.status(200).send(user.customTasks);  
    }
    else return res.status(400).send({messgae:"Invalid Date"})
  }

  async doneCustomTask(req,res)
  {
    const task = await userModel.findOneAndUpdate(
      {_id:req.user._id,"customTasks._id":{$eq : req.query.task}},
      {$set : {"customTasks.$.done":true}},
      {new: true}
      ).exec(function(error){
      if(error) return res.status(400).send({message:"عملیات ناموفق"})
      else return res.status(200).send({message:"باموفقیت انجام شد"})
    })
  }

  async deleteCustomTask(req,res)
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

  async getPins(req,res)
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