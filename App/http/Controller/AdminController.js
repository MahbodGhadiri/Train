const pinModel = require("../../Models/PinModel");
const setPinValidator =require( "../Validators/PinValidators");
const UserModel = require("../../Models/UserModel")
const {adminTaskModel,Filter} = require("../../Models/AdminTaskModel")
const {setTaskValidator,taskIdValidator} = require("../Validators/TaskValidators")
const {userIdValidator}=require("../Validators/UserValidators");

class AdminController 
{
    async getUsers (req,res)
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

    async getTasks(req,res)//optional query parameters for filtering : days , subject , user
    {
        const tasks = await adminTaskModel.find({});
        for (let i=0;i<tasks.length;i++)
        {
            const finishDate = new Date(tasks[i].finishDate).getTime();
            const now = Date.now();
            if ((Math.floor((finishDate-now)/(24*60*60*1000)))<0)
            {
                tasks[i].delayed=true;
                tasks[i].save();
            }
        }
        if(req.query.days||req.query.subject||req.query.user)
        {
            const filter = new Filter(tasks,req.query.days,req.query.subject,req.query.user);
            filter.byDays();
            filter.bySubject();
            filter.byUserId();
            return res.status(200).send({message:"با موفقیت انجام شد","tasks":filter.tasks}).json();
        }
        else return res.status(200).send({message:"انجام شد",tasks:tasks});
    }

    async setTask(req,res)
    {
        availableTags = ["گرافیک","برنامه نویسی","مدیریت","دیگر"];
        req.body.assignedBy={_id:req.user._id,name:req.user.name}
        const {error}=setTaskValidator(req.body); 
        if (error){ return res.status(400).send({message : error.message})};
        if (!(availableTags.includes(req.body.subjectTag))) return res.status(400).send({message : `تگ وارد شده(${req.body.subjectTag}) قابل قبول نمی باشد.`})
        const finishDate = new Date(req.body.finishDate).getTime()
        const startDate = new Date(req.body.startDate).getTime()
        if(finishDate>startDate) //TODO  startDate > now
        {
           await new adminTaskModel(req.body).save().then(res.status(201).send({message:"انجام شد"})); 
        }
        else return res.status(400).send({message:"تاریخ نامعتبر است!"})
    }

    async editTask(req,res)//required query parameter : task (id)
    {
        const {error}=taskIdValidator(req.query.task);
        if(error){return res.status(400).send({message: error.message})}
        const error2=setTaskValidator(req.body).error; 
        if (error2){ return res.status(400).send({message : error2.message})};
        const finishDate = new Date(req.body.finishDate).getTime()
        const startDate = new Date(req.body.startDate).getTime()
        if(finishDate>startDate)
        {
            req.body.delayed=false;
           await adminTaskModel.findOneAndUpdate({_id:{$eq:req.query.task}},req.body).then(res.status(200).send({message:"انجام شد"}));
           //TODO add a callback , wrong _id can cause a bug 
        }
        else return res.status(400).send({message:"Invalid Date"})
    }

    async doneTask(req,res)//required query parameter: task(id)
    {
        const {error}=taskIdValidator(req.query.task);
        if(error){return res.status(400).send({message: error.message})}
        await adminTaskModel.findOne({_id:{$eq:req.query.task}})
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
    async unDoneTask(req,res)//required query parameter: task(id)
    {
        const {error}=taskIdValidator(req.query.task);
        if(error){return res.status(400).send({message: error.message})}
        await adminTaskModel.findOne({_id:{$eq:req.query.task}})
        .exec((err,task)=>
        {
            if (err) {return res.status(404).send({message:"یافت نشد"})}
            if (task)
            {
                if (task.done === true)
                {
                    task.done = false;
                    task.save().then(res.status(200).send({message:"با موفقیت انجام شد"}));
                }
                else return res.status(200).send({meassage:"قبلا انجام شده"});  
            }
            else res.status(404).send({message:"یافت نشد"})
        }) ;
    }
    async deleteTask(req,res)//required query parameter: task(id)
    {
        const {error}=taskIdValidator(req.query.task);
        if(error){return res.status(400).send({message: error.message})}
        await adminTaskModel
        .findOneAndDelete({_id:{$eq:req.query.task}})
        .exec(function(error,task)
        {
            if(error) return res.status(400).send({message:"عملیات ناموفق"})
            else if(task) {res.status(200).send({message:"باموفقیت انجام شد"})}
            else  res.status(400).send({message:"وجود ندارد"})
        })
    }

    async setPin(req,res)
    {
        const {error}=setPinValidator(req.body);
        if (error){return res.status(400).send({message:error.message})}
        const pin = await pinModel(req.body);
        await pin.save();
        res.status(200).send({message:"پین با موفقیت ذخیره شد"});
    }

    async deletePin(req,res)//required query parameter: pin(id)
    {
        await pinModel.findOneAndDelete({_id:{$eq:req.query.pin}})
        .exec(function(error,pin)
        {
            if(error) return res.status(400).send({message:"عملیات ناموفق"})
            else if(pin) {res.status(200).send({message:"باموفقیت انجام شد"})}
            else  res.status(400).send({message:"وجود ندارد"})
        })
    }

    async activateUser(req,res)//required query parameter: user(id)
    {
        const {error}= userIdValidator(req.query.user);
        if(error){return res.status(400).send({message: error.message})}
        const user= await UserModel.findOne({_id:{$eq:req.query.user}});
        if(user&&user.email.active&&!user.activeAccount)
        {
            user.activeAccount = true;
            user.email.createdAt =undefined;
            await user.save();
            res.status(200).send({message:"انجام شد"});
        }
        else if (user.activeAccount)
        {
            res.status(200).send({message:"اکانت قبلا فعال شده است"});
        }
        else res.status(400).send({message:"کاربر وجود ندارد یا ایمیل کاربر به تایید نرسیده است"});
    }

    async deactivateUser(req,res)//required query parameter: user(id)
    {
        const {error}= userIdValidator(req.query.user);
        if(error){return res.status(400).send({message: error.message})}
        if (req.user._id !== req.query.user)
        {    const user= await UserModel.findOne({_id:{$eq:req.query.user}}); 
            if(user&&user.activeAccount)
            {
                if(user.role!=="super admin")
                {
                    user.activeAccount = false;
                    user.email.createdAt =undefined;
                    await user.save();
                    res.status(200).send({message:"انجام شد"});
                }
                else res.status(409).send({message:"شما نمی توانید سوپرادمین را غیرفعال کنید!"})
            }
            else res.status(400).send({message:"کاربر وجود ندارد یا اکانت کاربر فعال نیست"});
        }
        else res.status(409).send({message:"امکان غیر فعال سازی خود شخص وجود ندارد! می توانید از صفحه پروفایل اکانت خود را حذف کنید."})
    }

    async promoteUser(req,res)//required query parameter: user(id)
    {
        const {error}= userIdValidator(req.query.user);
        if(error){return res.status(400).send({message: error.message})}
        const user = await UserModel.findOne({_id:{$eq:req.query.user}});
        if(user&&user.activeAccount)
        {
            if(user.role==="user")
            {
                user.role="admin";
                user.email.createdAt =undefined;
                await user.save();
                return res.status(200).send({message:"انجام شد"})
            }else {return res.status(400).send({message:"کاربر از قبل ادمین است"})}
        }else{return res.status(404).send({message:"کاربر یافت نشد"})}
    }

    async demoteUser(req,res)//required query parameter: user(id)
    {
        const {error}= userIdValidator(req.query.user);
        if(error){return res.status(400).send({message: error.message})}
        const user = await UserModel.findOne({_id:{$eq:req.query.user}}); 
        if(user&&user.activeAccount)
        {
            if(user.role==="admin")
            {
                user.role="user";
                user.email.createdAt =undefined;
                await user.save();
                return res.status(200).send({message:"انجام شد"})
            }else {return res.status(400).send({message:"این کاربر ادمین نیست"})}
        }else{return res.status(404).send({message:"کاربر یافت نشد"})}
    }

    async deleteUser(req,res)//required query parameter: user(id)
    {
        const {error}= userIdValidator(req.query.user);
        if(error){return res.status(400).send({message: error.message})}
        const user = await UserModel.findOne({_id:{$eq:req.query.user}});
        if(user&&!(user.activeAccount))
        {
            await UserModel.deleteOne({_id:{$eq:req.query.user}})
            .then(()=>{
                res.status(200).send({message:"انجام شد!"})
            })
            .catch(()=>{
                res.status(500).send({message:"خطایی رخ داد!"})
            })
        }else{
            res.status(409).send({message:"امکان پذیر نمی باشد!"})
        }
    }

}



module.exports =  new AdminController;