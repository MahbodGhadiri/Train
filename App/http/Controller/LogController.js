const mongoose = require("mongoose");
const idValidator = require("../Validators/UserValidators").userIdValidator

const logConnection = mongoose.createConnection(process.env.MONGODB_ADDRESS);
const logSchema= new mongoose
    .Schema({
        timestamp: {type:Date,required:true} ,
        level: {type:String,required:true},
        message: {type:String,required:true},
    })
const logModel =  logConnection.model('log', logSchema,'log');

class LogController
{
    async getLog(req,res)
    {
        const log = await logModel.find();
        return res.status(200).send({log:log});
    }

    async deleteLog(req,res)
    {
        const {error}=idValidator(req.query.log);
        if(error) return res.status(400).send({message: error.message});
        logModel.deleteOne({$eq:{_id:req.query.log}})
        .then(()=>{return res.status(200).send({message:"با موفقیت پاک شد."})})
        .catch((error)=>{return res.status(500).send({message:"خطایی رخ داد."})})
    }

}

module.exports = new LogController;