const { Schema, model } = require( "mongoose");

const forgotPasswordTokenSchema = new Schema(
{
    _id : {type:String,required: true},
    token:{type:String,required:true},
    createdAt: {type:Date, expires: '10m' , default: Date.now}

})

forgotPasswordModel = model("tokens",forgotPasswordTokenSchema);

module.exports = forgotPasswordModel;