const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const SuperAdmin = require("../http/middlewares/SuperAdmin")
const AdminController = require( "../http/Controller/AdminController");

router.get("/users",[Auth,Admin],AdminController.getUsers)  //Done 

router.get("/tasks",[Auth,Admin],AdminController.getTasks)   //Done

router.post("/tasks",[Auth,Admin],AdminController.setTask) //Done

router.put("/tasks/edit",[Auth,Admin],AdminController.editTask) //Done

router.put("/tasks/done",[Auth,Admin],AdminController.doneTask) //unfinished

router.delete("/tasks/delete",[Auth,Admin],AdminController.deleteTask) //Done

router.post("/pin",[Auth,Admin],AdminController.setPin);  //Done

router.delete("/pin/delete",[Auth,Admin],AdminController.deletePin); //Done

router.put("/users/activate",[Auth,Admin,SuperAdmin],AdminController.activateUser) //Done

router.put("/users/deactivate",[Auth,Admin,SuperAdmin],AdminController.deactivateUser) //Done

router.put("/users/promote",[Auth,Admin,SuperAdmin],AdminController.promoteUser) //Done

router.put("/users/demote",[Auth,Admin,SuperAdmin],AdminController.demoteUser) //Done




module.exports= router;