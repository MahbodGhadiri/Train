const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const SuperAdmin = require("../http/middlewares/SuperAdmin")
const AdminController = require( "../http/Controller/AdminController");

router.get("/users",[Auth,Admin],AdminController.getUsers) //need more work //! priority 

router.get("/tasks",[Auth,Admin],AdminController.getTasks) //unfinished 

router.post("/tasks",[Auth,Admin],AdminController.setTask) //unfinished

router.put("/tasks/edit?task=",[Auth,Admin],AdminController.editTask) //unfinished

router.put("/tasks/done?task=",[Auth,Admin],AdminController.doneTask) //unfinished

router.delete("/tasks/delete?task=",[Auth,Admin],AdminController.deleteTask) //unfinished

router.post("/pins",[Auth,Admin],AdminController.setPin); //Check for bugs

router.delete("/pin/delete?pin=",[Auth,Admin],AdminController.setPin); //! URL changed, controller should be modified

router.put("/users/activate?user=",[Auth,Admin,SuperAdmin],AdminController.activateUser) //unfinished //! priority 

router.put("/users/deactivate?user=",[Auth,Admin,SuperAdmin],AdminController.deactivateUser) //unfinished

router.put("/users/promote?user=",[Auth,Admin,SuperAdmin],AdminController.promoteUser) //unfinished //! priority 

router.put("/users/demote?user=",[Auth,Admin,SuperAdmin],AdminController.demoteUser) //unfinished




module.exports= router;