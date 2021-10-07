const pinModel = require("../../Models/PinModel");
const setPinValidator =require( "../Validators/PinValidators");
const UserModel = require("../../Models/UserModel")
const adminTaskModel = require("../../Models/AdminTaskModel")
const {setTaskValidator} = require("../Validators/TaskValidators")

class AdminController 
{
    async getUsers (req,res)//TODO test this
    {
        const users = await UserModel
        .aggregate([
            {
                $project: 
                {
                    name:1,
                    "email.address":1,
                    "phone.number":1,
                    password:0,
                    role:1,
                    customeTasks:0,
                    ability:1,
                    avatarURL:1,
                    activeAccount:1,
                    activatedAt:1
                }
            }
        ]);
        res.status(200).send(users); 
    }

    async getTasks(req,res)//TODO test this //? am i missing something?
    {
        const tasks = await adminTaskModel.find({});
        res.status(200).send({message:"انجام شد",tasks:tasks});
    }

    async setTask(req,res)//TODO test this
    {
        const {error}=setTaskValidator(req.body); 
        if (error){ return res.status(400).send({message : error.message})};
   
        if(req.body.finishDate>req.body.startDate)
        {
           await new adminTaskModel(req.body).save().then(res.status(201).send()); 
        }
        else return res.status(400).send({messgae:"Invalid Date"})
    }

    async editTask(req,res)//TODO test it
    {
        const {error}=setTaskValidator(req.body); 
        if (error){ return res.status(400).send({message : error.message})};

        if(req.body.finishDate>req.body.startDate)
        {
           await adminTaskModel.findOneAndUpdate({_id:req.query.task},req.body).then(res.status(200).send({message:"انجام شد"}));
           //? what if taskID is wrong?
        }
        else return res.status(400).send({messgae:"Invalid Date"})
    }

    async doneTask(req,res)//unfinished
    {
        
    }

    async deleteTask(req,res)//TODO test this
    {
        await adminTaskModel
        .findOneAndDelete({_id:req.query.task})
        .exec(function(error)
        {
            if(error) return res.status(400).send({message:"عملیات ناموفق"})
            else return res.status(200).send({message:"باموفقیت انجام شد"})
        })
    }

    async setPin(req,res)//TODO test this
    {
        const {error}=setPinValidator(req.body);
        if (error){return res.status(400).send({message:error.message})}
        const pin = await pinModel(req.body);
        await pin.save();
        res.status(200).send({message:"پین با موفقیت ذخیره شد"});

    }

    async deletepin(req,res)//TODO test this
    {
        await pinModel.findOneAndDelete({_id:req.query.pin},function (err, docs) {
            if (err)
            {console.log(err)}
            else{ res.status(200).send({message:"پین پاک شد"})}
        })
    }

    async activateUser(req,res)//TODO test this
    {
        user= await UserModel.findOne({_id:req.query.user});
        if(user&&user.email.active&&!user.activeAccount)
        {
            user.activeAccount = true;
            await user.save();
            res.status(200).send({message:"انجام شد"});
        }
        else res.status(400).send({message:"کاربر وجود ندارد یا ایمیل کاربر به تایید نرسیده است"});
    }

    async deactivateUser(req,res)//TODO test this
    {
        user= await UserModel.findOne({_id:req.query.user});
        if(user&&user.activeAccount)
        {
            user.activeAccount = false;
            await user.save();
            res.status(200).send({message:"انجام شد"});
        }
        else res.status(400).send({message:"کاربر وجود ندارد یا اکانت کاربر فعال نیست"});
    }

    async promoteUser(req,res)//TODO test this
    {
        user = await UserModel.findOne({_id:req.query.user});
        if(user&&user.activeAccount)
        {
            if(user.role==="user")
            {
                user.role="admin";
                user.save();
                return res.status(200).send({message:"انجام شد"})
            }else {return res.status(400).send({message:"کاربر از قبل ادمین است"})}
        }else{return res.status(404).send({message:"کاربر یافت نشد"})}
    }

    async demoteUser(req,res)//TODO test this
    {
        user = await UserModel.findOne({_id:req.query.user});
        if(user&&user.activeAccount)
        {
            if(user.role==="admin")
            {
                user.role="user";
                user.save();
                return res.status(200).send({message:"انجام شد"})
            }else {return res.status(400).send({message:"این کاربر ادمین نیست"})}
        }else{return res.status(404).send({message:"کاربر یافت نشد"})}
    }

}

module.exports =  new AdminController;