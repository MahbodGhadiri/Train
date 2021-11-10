
const express = require("express");
const app =express();
const cookieParser=require("cookie-parser")
const mongoose = require("mongoose");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const fs = require("fs");
const http = require('http');
const https = require('https');
const certificate = fs.readFileSync(__dirname + '/../sslcert/certificate.crt', 'utf8');
const privateKey  = fs.readFileSync(__dirname+'/../sslcert/privateKey.key', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const errorHandler = require("./http/middlewares/ErrorHandler");
const config = require('../config/default.json');
const api = require("./Routes/api")
const cors = require("cors")

class application 
{
    
    constructor()
    {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMiddlewares();
        this.setupConfigs();
    }

    setupExpressServer()
    {
        const httpServer = http.createServer(app);
        const httpsServer = https.createServer(credentials, app);

        httpServer.listen(config.httpPort,(err)=>
        {
            if (err){
                console.log(err)
                winston.error(err)
            }
            else console.log(`http server Listening on port ${config.httpPort}`) 
        });

        httpsServer.listen(config.httpsPort,(err)=>
        {
            if (err){
                console.log(err)
                winston.error(err)
            }
            else console.log(`https server Listening on port ${config.httpsPort}`)    
        });
    }

    setupMongoose()
    {    
        mongoose
        .connect(config.MongoDB_Adrress,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>{
            console.log("Connected to DB")
        })
        .catch((err)=>{console.log(`Conection to DB failed \n`,err);})
    }

     setupRoutesAndMiddlewares()
    {
        const corsOpts = 
        {
           origin: 'http://localhost:3000',
           withCredentials: true,
           methods: 
           [
             'GET',
             'POST',
           ],
         
           allowedHeaders: 
           [
             'Content-Type'
           ],
        };

        app.use(express.json());
        app.use(express.urlencoded({extended:false}))
        app.use(cookieParser())
        app.use //? IS THIS NEEDED?
        (
            (req,res,next)=>{res.header('Access-Control-Allow-Credentials',true) ; next();}
        )
        app.use(cors(corsOpts)); 
     
        app.use("/api",api);
        app.use(errorHandler);
    }

    setupConfigs()
    {
        winston.add(new winston.transports.File({filename : "Error-log.log"}))
        winston.add(new winston.transports.MongoDB({db:config.MongoDB_log_Adrress},{useUnifiedTopology:true}))

        process.on("uncaughtExeption",(err)=>
        {
            console.log(err);
            winston.error(err.message);
        });
        process.on("unhandledRejection",(err)=>
        {
            console.log(err);
            winston.error(err.message);
        });
    }
}

module.exports = application;