const { Schema, model } = require( "mongoose");
const config = require("../../config/default.json");
const {refreshTokenModel} = require("./TokenModel");
const jwt = require("jsonwebtoken");
const emailSchema = {
    address:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},//expires:"15m" ,
    verificationToken:{type:String}
}

const phoneSchema = {
    number:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    //createdAt:{type:Date,expires:"15m" ,default:Date.now}, //! use this after adding phone number validation
    verificationToken:{type:String}
}
const customTaskSchema = new Schema({
    title:{type:String,require:true},
    task:{type:String,require:true},
    subjectTag: {type:String , required:true , enum:["گرافیک","برنامه نویسی","مدیریت","دیگر"]},
    done:{type:Boolean,default:false},
    failed:{type:Boolean,default:false}, //TODO check code and change "failed" to "delayed"
    startDate:{type:Date,required:true},
    finishDate:{type:Date,required:true}
    
})

const userSchema = new Schema({

    name:{type:String,require:true},
    email:emailSchema,
    phone:phoneSchema,
    password:{type:String,require:true},
    role:{type:String,default:"user",enum:["user","admin","super admin"]},
    customTasks:[customTaskSchema],
    ability:{type:String,enum:["برنامه نویسی","مدیریت","گرافیک","دیگر"]},
    avatarURL:{type:String},
    activeAccount:{type:Boolean,default:false},
    activatedAt:{type:Date} //! for activateUser Api, but should this data even exist?
})

//TODO refresh and access tokens 
//! The following method is incomplete , regenration and token rotation + access Tokens are required!!
//! as a result of changes made to this method malfunction of Auth middleware is possible!!
userSchema.methods.generateRefreshToken = async function (oldRefreshToken) 
{
    if(!oldRefreshToken)
    {
        const data = 
        {
          _id: this._id,
        };
      
        let refreshToken = jwt.sign(data, config.secretKey , {expiresIn: 4 * 60 * 60});
        refreshToken =await new refreshTokenModel({_id:refreshToken});
        await refreshToken.save();
        return refreshToken;
    }
    else
    {
        let oldToken = await refreshTokenModel.findOne({_id:oldRefreshToken});
        if(!oldToken) return null;
        if(oldToken.nextToken)
        {
            while(oldToken.nextToken){

                const nextToken = await refreshTokenModel.findOne({_id:oldToken.nextToken});
                await oldToken.remove();
                oldToken=nextToken;
            }
            await oldToken.remove();
            return null;
        }
        const data = 
        {
          _id: this._id,
        };
      
        let refreshToken = jwt.sign(data, config.secretKey , {expiresIn: 4 * 60 * 60});
        oldToken.nextToken=refreshToken;
        oldToken.deleteAt= new Date(Date.now()+(5*60000));
        oldToken.save();
        refreshToken =await new refreshTokenModel({_id:refreshToken});
        await refreshToken.save()
        return refreshToken;
    }
   
}

userSchema.methods.generateAccessToken = async function () 
{
    let accessToken = jwt.sign(this.getEssentialData(), config.secretKey , {expiresIn: 10 * 60});
    return accessToken;
}

userSchema.methods.getEssentialData = function()
{
    data={
        _id:this._id,
        role:this.role
    }
    return data;
}

const userModel = new model("users",userSchema)

module.exports = userModel;