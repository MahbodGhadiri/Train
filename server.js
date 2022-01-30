require('dotenv').config({path:"./config.env"});
const cluster = require('cluster');
if (cluster.isMaster){
    console.log("\u001b[1;33mStarting the cluster\u001b[0m");
    //getting number of proccessor cores
    const cpuCount = require("os").cpus().length;
    for (let i=0;i<cpuCount; i+=1){
        // creating cluster workers
        cluster.fork();
    }

    //respawning dead workers
    cluster.on('exit',(worker)=>{
        cluster.fork();
    })
} else{
    const App = require("./App");
    new App();
}
