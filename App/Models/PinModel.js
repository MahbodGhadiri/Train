const { Schema, model } = require( "mongoose");

const pinSchema = new Schema({
    title:{type:String,require:true},
    message:{type:String,require:true}
})

const pinModel = new model("pins",pinSchema);

module.exports = pinModel;