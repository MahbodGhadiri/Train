const { Schema, model } = require( "mongoose");

const forgotPasswordTokenSchema = new Schema(
{
    _id : {type:String,required: true},
    token:{type:String,required:true},
    createdAt: {type:Date, expires: '10m' , default: Date.now}

})

const refreshTokenSchema = new Schema({
    _id:{type:String,required:true},
    userId:{type:String,required:true},
    nextToken:{type:String},
    timeStamp:{type:Date,default:Date.now,expires:"4h"},
    invalidSince:{type:Date,expire:"5m",required:false}
})



forgotPasswordModel = model("tokens",forgotPasswordTokenSchema);
refreshTokenModel = model("refreshTokens",refreshTokenSchema);


module.exports = {forgotPasswordModel,refreshTokenModel};