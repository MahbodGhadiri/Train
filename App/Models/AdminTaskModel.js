const mongoose = require("mongoose")

const adminTaskSchema = new mongoose.Schema({
    title:{type:String,require:true},
    task:{type:String,require:true},
    subjectTag: {type:String , required:true , enum:["گرافیک","برنامه نویسی","مدیریت","دیگر"]},
    executors:{type:Array,require:true},
    assignedBy:{type:String,require:true},
    done:{type:Boolean,default:false},
    delayed:{type:Boolean,default:false},
    startDate:{type:Date,required:true},
    finishDate:{type:Date,required:true}
  
})

const adminTaskModel = new mongoose.model("tasks",adminTaskSchema);

module.exports = adminTaskModel;