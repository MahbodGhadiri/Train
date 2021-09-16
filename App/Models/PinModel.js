const mongoose = require("mongoose")

const pinSchema = new mongoose.Schema({
    title:{type:String,require:true},
    message:{type:String,require:true}
})

const pinModel = new mongoose.Model("pins",pinSchema);

module.exports = pinModel;