
const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const AuthController = require( "../http/Controller/AuthController");
const UserController =require( "../http/Controller/UserController");

router.post("/register",AuthController.register);

router.post("/login",AuthController.login);

router.post("/resendActivationEmail",AuthController.resendActivationEmail);

router.get("/verify_email/:userId/:emailVerificationToken",AuthController.activateEmail);

router.put("/resetPassword",Auth,AuthController.resetPassword);

router.get("/forgotPassword/:userEmail",AuthController.forgotPassword);

router.get("/pins",Auth,UserController.getPins);

module.exports = router;