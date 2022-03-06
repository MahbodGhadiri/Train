const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const SuperAdmin = require("../http/middlewares/SuperAdmin")
const LogController = require( "../http/Controller/LogController");

router.get("/",[Auth,Admin,SuperAdmin],LogController.getLog);

router.delete("/",[Auth,Admin,SuperAdmin],LogController.deleteLog);

module.exports= router