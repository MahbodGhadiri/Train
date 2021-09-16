module.exports= function (res,req,next){

    //to be completed
    if(req.body.token.role==="admin"||"super admin"){next()}
    else {return res.status(401).send("شما سطح دسترسی لازم را ندارید")}
    
}
