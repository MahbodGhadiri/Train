const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const UserController =require( "../http/Controller/UserController");

router.get("/pins",Auth,UserController.getPins);

module.exports = router;