
const router = require("express").Router();
const Auth = require("../http/middlewares/Auth");
const AuthController = require("../http/Controller/AuthController")

router.post("/register",AuthController.register);

router.post("/login",AuthController.login);

router.get("/verify_email/:userId/:emailVerificationToken",AuthController.activateEmail);

//just for testing Auth middleware
router.get("/",Auth,(req,res)=>{res.send(req.body)});

module.exports = router;