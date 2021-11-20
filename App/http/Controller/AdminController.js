const pinModel = require("../../Models/PinModel");
const setPinValidator =require( "../Validators/PinValidators");
const UserModel = require("../../Models/UserModel")
const {adminTaskModel,Filter} = require("../../Models/AdminTaskModel")
const {setTaskValidator} = require("../Validators/TaskValidators")

class AdminController 
{
    async getUsers (req,res)//Done
    {
        const users = await UserModel
        .aggregate([
            {
                $project: 
                {
                    "email.verficationToken":0,
                    password:0,
                    customTasks:0,
                }
            }
        ]);
        res.status(200).send(users); 
    }

    async getTasks(req,res)//Done //optional query parameters for filtering : days , subject 
    {
        const tasks = await adminTaskModel.find({});
        if(req.query.days||req.query.subject)
        {
            const filter = new Filter(tasks,req.query.days,req.query.subject);
            filter.byDays();
            filter.bySubject();
            res.status(200).send({message:"با موفقیت انجام شد","tasks":filter.tasks}).json();
        }
        else res.status(200).send({message:"انجام شد",tasks:tasks});
    }

    async setTask(req,res)//Done
    {
        req.body.assignedBy = req.user._id;
        const {error}=setTaskValidator(req.body); 
        if (error){ return res.status(400).send({message : error.message})};
   
        if(req.body.finishDate>req.body.startDate)
        {
           await new adminTaskModel(req.body).save().then(res.status(201).send({message:"انجام شد"})); 
        }
        else return res.status(400).send({messgae:"Invalid Date"})
    }

    async editTask(req,res)//Done
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

    async doneTask(req,res)//Done
    {
    const task = await AdminTaskModel.findById(req.query.task)
    .exec((err,task)=>
    {
    if (err) {return res.status(404).send({message:"یافت نشد"})}
    if (task)
    {
        if (task.done === false)
          {
            task.done = true;
            task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}));
          }
          else return res.status(200).send({meassage:"قبلا انجام شده"});
        
    }
    else res.status(404).send({message:"یافت نشد"})
    }) ;
    }

    async deleteTask(req,res)//ِDone
    {
        await adminTaskModel
        .findOneAndDelete({_id:req.query.task})
        .exec(function(error,task)
        {
            if(error) return res.status(400).send({message:"عملیات ناموفق"})
            else if(task) {res.status(200).send({message:"باموفقیت انجام شد"})}
            else  res.status(400).send({message:"وجود ندارد"})
        })
    }

    async setPin(req,res)//Done
    {
        const {error}=setPinValidator(req.body);
        if (error){return res.status(400).send({message:error.message})}
        const pin = await pinModel(req.body);
        await pin.save();
        res.status(200).send({message:"پین با موفقیت ذخیره شد"});

    }

    async deletePin(req,res)//Done
    {
        await pinModel.findOneAndDelete({_id:req.query.pin})
        .exec(function(error,pin)
        {
            if(error) return res.status(400).send({message:"عملیات ناموفق"})
            else if(pin) {res.status(200).send({message:"باموفقیت انجام شد"})}
            else  res.status(400).send({message:"وجود ندارد"})
        })
    }

    async activateUser(req,res)//Done
    {
        const user= await UserModel.findOne({_id:req.query.user});
        if(user&&user.email.active&&!user.activeAccount)
        {
            user.activeAccount = true;
            await user.save();
            res.status(200).send({message:"انجام شد"});
        }
        else if (user.activeAccount)
        {
            res.status(200).send({message:"اکانت قبلا فعال شده است"});
        }
        else res.status(400).send({message:"کاربر وجود ندارد یا ایمیل کاربر به تایید نرسیده است"});
    }

    async deactivateUser(req,res)//Done
    {
        const user= await UserModel.findOne({_id:req.query.user});
        if(user&&user.activeAccount)
        {
            user.activeAccount = false;
            await user.save();
            res.status(200).send({message:"انجام شد"});
        }
        else res.status(400).send({message:"کاربر وجود ندارد یا اکانت کاربر فعال نیست"});
    }

    async promoteUser(req,res)//Done
    {
        const user = await UserModel.findOne({_id:req.query.user});
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

    async demoteUser(req,res)//Done
    {
        const user = await UserModel.findOne({_id:req.query.user});
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