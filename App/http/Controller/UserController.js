const pinModel = require( "../../Models/PinModel");


class UserController
{
    async getPins(req,res) 
    {
        const pins = await pinModel.find({});
        if (!pins)
        {
            res.status(404).send({message:"پینی یافت نشد"});
        }
        res.status(200).send(pins);
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
}

module.exports = new UserController;