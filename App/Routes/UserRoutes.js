const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const UserController =require( "../http/Controller/UserController");

router.get("/profile",Auth,UserController.getProfile); //Done

router.get("/logout",Auth,UserController.logout); //Done

router.post("/delete-account",Auth,UserController.deleteAccount); //Mostly Done, Check comments in controller

router.put("/change-info",Auth,UserController.changeInfo); //unfinished

router.post("/change-password",Auth,UserController.changePassword); //Done 

router.get("/tasks",Auth,UserController.getTasks); //Done
router.get("/tasks/done",Auth,UserController.doneTask); //Done

router.get("/tasks/delay",Auth,UserController.delayTask); //Done

router.get("/custom-tasks",Auth,UserController.getCustomTasks); //Done

router.post("/custom-tasks",Auth,UserController.setCustomTask); //Done

router.put("/custom-tasks/edit",Auth,UserController.editCustomTask); //Done

router.get("/custom-tasks/done",Auth,UserController.doneCustomTask); //Done

router.delete("/custom-tasks/delete",Auth,UserController.deleteCustomTask); //Done

router.get("/pins",Auth,UserController.getPins); //Done

module.exports = router;