const { Schema, model } = require( "mongoose");
const config = require("../../config/default.json")
const jwt = require("jsonwebtoken")
const emailSchema = {
    address:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    createdAt:{type:Date,expires:"15m" ,default:Date.now},
    verificationToken:{type:String}
}

const phoneSchema = {
    number:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    //createdAt:{type:Date,expires:"15m" ,default:Date.now}, //! use this after adding phone number validation
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
    activeAccount:{type:Boolean,default:false},
    activatedAt:{type:Date} //! for activateUser Api, but should this data even exist?
})

//TODO refresh and access tokens
userSchema.methods.generateAuthToken = function () 
{
    const data = 
    {
      _id: this._id,
      password: this.password //TODO change this
    };
  
    return jwt.sign(data, config.secretKey , {expiresIn: 4 * 60 * 60});
}


const userModel = new model("users",userSchema)

module.exports = userModel;