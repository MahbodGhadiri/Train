const fs= require("fs")
const crypto=require("crypto")
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})

getPort= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question('Enter Port (default: 8080):    ',(port)=>{
            if(port==undefined || port==""){
                fs.writeFile("./config.env",`PORT= 8080\n`,{flag:"w+"},()=>{
                    resolve()
                });
            }
            else{
                fs.writeFile("./config.env",`PORT= ${port}\n`,{flag:"w+"},()=>{
                    resolve()
                });
            }
        })
    })
}

getDomain= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question('Enter Domain (default: localhost:8080):    ',(domain)=>{
            if(domain==undefined||domain==""){
                fs.writeFile("./config.env",`DOMAIN= "http://localhost:8080"\n`,{flag:"a+"},()=>{
                resolve();
                })
            }
            else{
                fs.writeFile("./config.env",`DOMAIN= "${domain}"\n`,{flag:"a+"},()=>{
                resolve();
                })
            }
        })
    })
}


getISDevelopment= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question("is this development enviroment? (default: true):   ",(isdevelopment)=>{
            if(isdevelopment==="false"){
                fs.writeFile("./config.env",`DEVELOPMENT= "false"\n`,{flag:"a+"},()=>{
                    resolve();
                })
            }
            else(
                fs.writeFile("./config.env",`DEVELOPMENT= "true"\n`,{flag:"a+"},()=>{
                    resolve();
                })
            )
        })

    })
}

getDbAddress= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question("Enter mongoDB connection string (default: mongodb://localhost:27017/Train):  ",(dbAddress)=>{
            if(dbAddress==undefined||dbAddress==""){
                fs.writeFile("./config.env",`MONGODB_ADDRESS= "mongodb://localhost:27017/Train"\n`,{flag:"a+"},()=>{
                    resolve();
                })
            }
            else{
                fs.writeFile("./config.env",`MONGODB_ADDRESS= "${dbAddress}"\n`,{flag:"a+"},()=>{
                    resolve();
                }) 
            }
        })
    })
}

getSecretKey= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question("Enter Secretkey (By default generates randome key):    ",(key)=>{
            if(key==undefined||key==""){
                key=crypto.randomBytes(16).toString("hex");
                fs.writeFile("./config.env",`SECRET_KEY= "${key}"\n`,{flag:"a+"},()=>{
                    resolve();
                })
            }
            else{
                fs.writeFile("./config.env",`SECRET_KEY= "${key}"\n`,{flag:"a+"},()=>{
                    resolve();
                })
            }
        })
    })
}

getTransportMail= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question("Enter Mail address (no default):  ",(mail)=>{
                fs.writeFile("./config.env",`TRANSPORT_MAIL= "${mail}"\n`,{flag:"a+"},()=>{
                    resolve();
                }) 
            }
        )
    })
}

getTransportPassword= ()=>{
    return new Promise((resolve,reject)=>{
        rl.question("Enter Mail password (no default):  ",(mail)=>{
                fs.writeFile("./config.env",`TRANSPORT_PASS= "${mail}"\n`,{flag:"a+"},()=>{
                    resolve();
                }) 
            }
        )
    })
}
async function main(){
    console.log(`\u001b[1;33mPress Enter without any input to use default variables, misconfiguration can cause issue when running the server!\u001b[0m`)
    await getPort();
    await getDomain();
    await getISDevelopment();
    await getDbAddress();
    await getSecretKey();
    await getTransportMail();
    await getTransportPassword();
    rl.close()
}

main();