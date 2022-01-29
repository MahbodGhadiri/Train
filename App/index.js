
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
const api = require("./Routes/api");
const path = require("path");
const rateLimit = require("express-rate-limit").default;
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

        httpServer.listen(process.env.httpPort,(err)=>
        {
            if (err){
                console.log(err)
                winston.error(err)
            }
            else console.log(`http server Listening on port ${process.env.httpPort}`) 
        });

        httpsServer.listen(process.env.httpsPort,(err)=>
        {
            if (err){
                console.log(err)
                winston.error(err)
            }
            else console.log(`https server Listening on port ${process.env.httpsPort}`)    
        });
    }

    setupMongoose()
    {    
        mongoose
        .connect(process.env.MongoDB_Adrress,{useNewUrlParser:true,useUnifiedTopology:true})
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
             'PUT',
             'DELETE'
           ],

           allowedHeaders: 
           [
             'Content-Type'
           ],
        };
        const apiLimiter = new rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
            message: "Too many Requests",
        })
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minute
            max: 10000, // Limit each IP to 10 requests per `window` (here, per 1 minute)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
            message: "Too many Requests",
        })
        app.use(express.json());
        app.use(express.urlencoded({extended:false}))
        app.use(express.static(path.resolve(__dirname,"../Client/build")))
        app.use(cookieParser())
        app.use //? IS THIS NEEDED?
        (
            (req,res,next)=>{res.header('Access-Control-Allow-Credentials',true) ; next();}
        )
        app.use(cors(corsOpts)); 
        app.set('view engine','ejs');
        app.use("/api",apiLimiter);
        app.use("/api",api);
        app.get('*',limiter,(req,res)=>{
            return res.sendFile(path.resolve(__dirname,"../Client/build","index.html"))
          })
        app.use(errorHandler);
    }

    setupConfigs()
    {
        winston.add(new winston.transports.File({filename : "Error-log.log"}))
        winston.add(new winston.transports.MongoDB({db:process.env.MongoDB_log_Adrress},{useUnifiedTopology:true}))

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