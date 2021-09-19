const { Schema, model } = require( "mongoose");

const emailSchema = {
    address:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    verificationToken:{type:String}
}

const phoneSchema = {
    number:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    verificationToken:{type:String}
}
const personalTaskSchema = new Schema({
    title:{type:String,require:true},
    task:{type:String,require:true},
    subjectTag: {type:String , required:true , enum:["گرافیک","برنامه نویسی","مدیریت","دیگر"]},
    done:{type:Boolean,default:false},
    failed:{type:Boolean,default:false},
    startDate:{type:Date,required:true},
    finishDate:{type:Date,required:true}
    
})

const userSchema = new Schema({

    name:{type:String,require:true},
    email:emailSchema,
    phone:phoneSchema,
    password:{type:String,require:true},
    role:{type:String,default:"user",enum:["user","admin","super admin"]},
    personalTasks:[personalTaskSchema],
    ability:{type:String,enum:["برنامه نویسی","مدیریت","گرافیک","دیگر"]},
    avatarURL:{type:String},
    activeAccount:{type:Boolean,default:false}
})


    

const userModel = new model("users",userSchema)

module.exports = userModel;