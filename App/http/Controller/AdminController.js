const pinModel = require("../../Models/PinModel");
const setPinValidator =require( "../Validators/PinValidators");

class AdminController 
{
    async getUsers (req,res)//unfinished
    {

    }

    async getTasks(req,res)//unfinished
    {
        
    }

    async setTask(req,res)//unfinished
    {
        
    }

    async editTask(req,res)//unfinished
    {
        
    }

    async doneTask(req,res)//unfinished
    {
        
    }

    async deleteTask(req,res)//unfinished
    {

    }

    async setPin(req,res)//check for bugs
    {
        const {error}=setPinValidator(req.body);
        if (error){return res.status(400).send({message:error.message})}
        const pin = await pinModel(req.body);
        await pin.save();
        res.status(200).send({message:"پین با موفقیت ذخیره شد"});

    }

    async deletepin(req,res)//! modify this
    {
        const pinId = req.params;
        await pinModel.findOneAndDelete({_id:pinId},function (err, docs) {
            if (err)
            {console.log(err)}
            else{ res.status(200).send({message:"پین پاک شد"})}
        })
    }

    async activateUser(req,res)//unfinished
    {

    }

    async deactivateUser(req,res)//unfinished
    {

    }

    async promoteUser(req,res)//unfinished
    {

    }

    async demoteUser(req,res)//unfinished
    {

    }

}

module.exports =  new AdminController;