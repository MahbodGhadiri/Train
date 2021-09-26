const pinModel = require( "../../Models/PinModel");
const userModel = require("../../Models/UserModel");
const _ = require("lodash")
const {deleteAccountValidator , setCustomTaskValidator} = require("../Validators/UserValidators")

class UserController
{
  async getProfile(req,res) //TODO Test it
  {
    user = await userModel.findbyId(req.user._id);
    if (!user) res.status(404).send({message:"یافت نشد"});
    res.status(200).send(_.pick(user,["name","email.address","phone.number","ability","role","avatarURL"]));
  }

  async logout(req,res) //unfinished
  {
      //Expire refresh Token //? and cookies  
  }

  async deleteAccount(req,res) //TODO Test it
  {
    const {error}=deleteAccountValidator(req.body); 
    if (error){ res.status(400).send({message : error.message})};

    user = await userModel.findById(req.user._id); //TODO Callback
    if (!user) res.status(404).send({message:"یافت نشد"})

    if(await argon2.verify(user.password,req.body.password,{
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2})
      )
    {
      user.remove().then(res.status(200).send({message:"اکانت شما با موفقیت حذف شد"}));
    }
  }

  async changeInfo(req,res) //unfinished
  {
        
  }

  async changePassword(req,res) //TODO check for bugs
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

  async getCustomTasks(req,res) //TODO Test it
  {
    const tasks = await userModel
    .aggregate(
      [{$match : {_id:req.user._id}},
      {$project:{_id:0 , personalTask:1}}]
    )
    res.status(200).send(tasks[0].personalTask).json(); //? is .json() needed?
  }

  async setCustomTask(req,res) //TODO Test it
  {
    const {error}=setCustomTaskValidator(req.body); 
    if (error){ res.status(400).send({message : error.message})};
   
    const user = await userModel.findOne({_id:req.user._id})
    if(!user) {return res.status(404).send({message:"یافت نشد"})}
   
    user.personalTask.push(req.body);
    
    await user.save();
   
    res.status(200).send(user.personalTask[user.personalTask.length-1]);   
  }

  async editCustomTask(req,res) //TODO Test it 
  {
    const {error}=setPersonalTaskValidator(req.body); 
    if (error){ return res.status(400).send({message : error.message})};

    const user=await userModel
    .findOneAndUpdate(
    {"personalTask._id":req.query.task},
    {$set : {"personalTask.$":req.body},
    new:true}
    )

    if (!user){return res.status(404).send({message:"یافت نشد"})}
    res.send(user.personalTask);     
  }

  async doneCustomTask(req,res) //TODO Test it
  {
    const task = await userModel.findByIdAndUpdate(req.query.task,{
      $set : {
        "customTasks.$.done":true
      }
    }).exec(function(error){
      if(error) return res.status(400).send({message:"عملیات ناموفق"})
      return res.status(200).send({message:"باموفقیت انجام شد"})
    })
  }

  async deleteCustomTask(req,res) //TODO Test it //! Modify it to be compatible with URL
  {
    await userModel
    .updateOne(
    {"personalTasks._id":req.query.task}, //?is query working //! code injection attack
    {$pull: {"Tasks.$":{"_id":taskId}}}
    ) //add callback with response
    res.status(200).send({message:"با موفقیت انجام شد"})

  }

  async getPins(req,res) //looks fine, check for Bugs
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