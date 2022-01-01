const { Schema, model } = require( "mongoose");
const {refreshTokenModel} = require("./TokenModel");
const jwt = require("jsonwebtoken");
const emailSchema = {
    address:{type:String,required:true,unique:true},
    active:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now,expires:"15m"},
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
    delayed:{type:Boolean,default:false}, 
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


//TODO expire old refresh tokens in database in 5 minutes
userSchema.methods.generateRefreshToken = async function (oldRefreshToken) 
{
    if(!oldRefreshToken)
    {
        const data = 
        {
          _id: this._id,
          r: Math.random()
        };
      
        let refreshToken = jwt.sign(data, process.env.secretKey , {expiresIn: 4 * 60 * 60});
        refreshToken =await new refreshTokenModel({_id:refreshToken,userId:this._id});
        await refreshToken.save();
        return refreshToken; //? ._id
    }
    else
    {
        let oldToken = await refreshTokenModel.findOne({_id:oldRefreshToken});
        if(!oldToken) return null;
        if(oldToken.nextToken)
        { 
            while(oldToken){

                const nextToken = await refreshTokenModel.findOne({_id:oldToken.nextToken});
                await oldToken.remove();
                oldToken=nextToken;
            }
            return null;
        }
        const data = 
        {
          _id: this._id,
          r: Math.random()
        };
      
        let refreshToken = jwt.sign(data, process.env.secretKey , {expiresIn: 4 * 60 * 60});
        oldToken.nextToken=refreshToken;
        oldToken.invalidSince=Date.now();
        oldToken.save();
        console.log(`line 88 , Token : ${refreshToken}`)
        if (!await refreshTokenModel.findOne({_id:refreshToken})) //? is this if helpful?
        {
            refreshToken =await new refreshTokenModel({_id:refreshToken,userId:this._id});
            await refreshToken.save()
            return refreshToken;
        }
        return refreshToken;
    }
   
}

userSchema.methods.generateAccessToken = async function () 
{
    let accessToken = jwt.sign(this.getEssentialData(), process.env.secretKey , {expiresIn: 10 * 60});
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