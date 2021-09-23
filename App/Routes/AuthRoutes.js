const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const AuthController = require( "../http/Controller/AuthController");

router.post("/register",AuthController.register);

router.post("/login",AuthController.login);

router.post("/resendActivationEmail",AuthController.resendActivationEmail);

router.get("/verify_email/:userId/:sendedVerificationToken",AuthController.activateEmail);

router.post("/forgot-password",AuthController.forgotPassword);

router.get("/forgot-password/login/:userId/:sendedVerificationToken",AuthController.forgotPasswordLogin);

router.put("/reset-password",Auth,AuthController.resetPassword);

module.exports = router;
