const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const UserController =require( "../http/Controller/UserController");

router.get("/profile",Auth,UserController.getProfile);

router.get("/logout",Auth,UserController.logout);

router.post("/delete-account",Auth,UserController.deleteAccount);

router.put("/change-info",Auth,UserController.changeInfo); 

router.post("/change-password",Auth,UserController.changePassword);

router.get("/tasks",Auth,UserController.getTasks); //optional query parameters: days , subject

router.get("/tasks/done",Auth,UserController.doneTask); //required query parameter : task(id)

router.get("/tasks/delay",Auth,UserController.delayTask); //required query parameter : task(id)

router.get("/custom-tasks",Auth,UserController.getCustomTasks);

router.post("/custom-tasks",Auth,UserController.setCustomTask);

router.put("/custom-tasks/edit",Auth,UserController.editCustomTask);

router.get("/custom-tasks/done",Auth,UserController.doneCustomTask);

router.delete("/custom-tasks/delete",Auth,UserController.deleteCustomTask);

router.get("/pins",Auth,UserController.getPins);

module.exports = router;