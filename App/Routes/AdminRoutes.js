const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const Admin = require( "../http/middlewares/Admin");
const SuperAdmin = require("../http/middlewares/SuperAdmin")
const AdminController = require( "../http/Controller/AdminController");

router.get("/users",[Auth,Admin],AdminController.getUsers);

router.get("/tasks",[Auth,Admin],AdminController.getTasks); //optional query parameters for filtering : days , subject

router.post("/tasks",[Auth,Admin],AdminController.setTask);

router.put("/tasks/edit",[Auth,Admin],AdminController.editTask); //required query parameter : task (id)

router.put("/tasks/done",[Auth,Admin],AdminController.doneTask); //required query parameter: task(id)

router.delete("/tasks/delete",[Auth,Admin],AdminController.deleteTask); //required query parameter: task(id)

router.post("/pin",[Auth,Admin],AdminController.setPin);

router.delete("/pin/delete",[Auth,Admin],AdminController.deletePin); //required query parameter: pin(id)

router.put("/users/activate",[Auth,Admin,SuperAdmin],AdminController.activateUser); //required query parameter: user(id)

router.put("/users/deactivate",[Auth,Admin,SuperAdmin],AdminController.deactivateUser); //required query parameter: user(id)

router.put("/users/promote",[Auth,Admin,SuperAdmin],AdminController.promoteUser); //required query parameter: user(id)

router.put("/users/demote",[Auth,Admin,SuperAdmin],AdminController.demoteUser); //required query parameter: user(id)

module.exports= router;