const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const AuthController = require( "../http/Controller/AuthController");

router.post("/register",AuthController.register); 

router.post("/login",AuthController.login); 

router.get("/resendActivationEmail",AuthController.resendActivationEmail); 

router.get("/verify_email/:userId/:sendedVerificationToken",AuthController.activateEmail); 
//required params : userId and sendedVerficationToken(created in register API)

router.post("/forgot-password",AuthController.forgotPassword); //TODO Add reset with phonenumber option

router.get("/forgot-password/login/:userId/:sendedVerificationToken",AuthController.forgotPasswordLogin); 
//need co op with frontend //required params : userId & Token (created in forgotPassword Method)

router.put("/reset-password",Auth,AuthController.resetPassword); //looks fine , needs to be checked for bugs

module.exports = router;
