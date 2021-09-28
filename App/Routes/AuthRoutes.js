const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const AuthController = require( "../http/Controller/AuthController");

router.post("/register",AuthController.register); //Done

router.post("/login",AuthController.login); //Done

router.get("/resendActivationEmail",AuthController.resendActivationEmail); //Done

router.get("/verify_email/:userId/:sendedVerificationToken",AuthController.activateEmail); //Done for now

router.post("/forgot-password",AuthController.forgotPassword); //Add reset with phonenumber option

router.get("/forgot-password/login/:userId/:sendedVerificationToken",AuthController.forgotPasswordLogin); //need co op with frontend

router.put("/reset-password",Auth,AuthController.resetPassword);//looks fine , needs to be checked for bugs

module.exports = router;
