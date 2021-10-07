const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const SuperAdmin = require("../http/middlewares/SuperAdmin")
const AdminController = require( "../http/Controller/AdminController");

router.get("/users",[Auth,Admin],AdminController.getUsers)  //TODO test this 

router.get("/tasks",[Auth,Admin],AdminController.getTasks)   //TODO test this

router.post("/tasks",[Auth,Admin],AdminController.setTask) //TODO test this

router.put("/tasks/edit?task=",[Auth,Admin],AdminController.editTask) //TODO test this

router.put("/tasks/done?task=",[Auth,Admin],AdminController.doneTask) //unfinished

router.delete("/tasks/delete?task=",[Auth,Admin],AdminController.deleteTask) //TODO test this

router.post("/pins",[Auth,Admin],AdminController.setPin);  //TODO test this

router.delete("/pin/delete?pin=",[Auth,Admin],AdminController.setPin); //!  //TODO test this

router.put("/users/activate?user=",[Auth,Admin,SuperAdmin],AdminController.activateUser) //TODO test this

router.put("/users/deactivate?user=",[Auth,Admin,SuperAdmin],AdminController.deactivateUser) //TODO test this

router.put("/users/promote?user=",[Auth,Admin,SuperAdmin],AdminController.promoteUser) //TODO test this

router.put("/users/demote?user=",[Auth,Admin,SuperAdmin],AdminController.demoteUser) //TODO test this




module.exports= router;