
const express = require("express");
const app =express();
const cookieParser=require("cookie-parser")
const mongoose = require("mongoose");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const errorHandler = require("./http/middlewares/ErrorHandler");
const config = require('../config/default.json');
const api = require("./Routes/api")

class application {
    
    constructor(){
    this.setupExpressServer();
    this.setupMongoose();
    this.setupRoutesAndMiddlewares();
    this.setupConfigs();
    }

    setupExpressServer(){
        app.listen(config.port,(err)=>{
            if (err){
                console.log(err)
                winston.error(err)
            }
            else{
                console.log(`Listening on port ${config.port}`)
            }
        });
    }

    setupMongoose(){
        
        mongoose.connect(config.MongoDB_Adrress,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>{
            console.log("Connected to DB")
        })
        .catch((err)=>{console.log(`Conection to DB failed \n`,err);})
    }

     setupRoutesAndMiddlewares(){
     app.use(express.json());
     app.use(cookieParser())
     app.use("/api",api);
     app.use(errorHandler);
     }

    setupConfigs(){
        winston.add(new winston.transports.File({filename : "Error-log.log"}))
        winston.add(new winston.transports.MongoDB({db:config.MongoDB_log_Adrress},{useUnifiedTopology:true}))

        process.on("uncaughtExeption",(err)=>{
            console.log(err);
            winston.error(err.message);
        });
        process.on("unhandledRejection",(err)=>{
            console.log(err);
            winston.error(err.message);
        });
     }
}

module.exports = application;