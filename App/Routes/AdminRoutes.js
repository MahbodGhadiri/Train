const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const AdminController = require( "../http/Controller/AdminController");

router.post("/pin",[Auth,Admin],AdminController.setPin);

router.delete("/pin/:pinId",[Auth,Admin],AdminController.setPin);

module.exports= router;