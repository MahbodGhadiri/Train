const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const UserController =require( "../http/Controller/UserController");

router.get("/profile",Auth,UserController.getProfile); //Done

router.get("/logout",Auth,UserController.logout); //Done

router.post("/delete-account",Auth,UserController.deleteAccount); //Mostly Done, Check comments in controller

router.put("/change-info",Auth,UserController.changeInfo); //unfinished

router.post("/change-password",Auth,UserController.changePassword); //Done //? why post method?

router.get("/tasks",Auth,UserController.getTasks); //! awaiting tests ------------------------------------------------

router.get("/tasks/done?task=",Auth,UserController.doneTask); //! awaiting tests -------------------------------------

router.get("/tasks/delay?task=",Auth,UserController.delayTask); //! awaiting tests -----------------------------------

router.get("/custom-tasks",Auth,UserController.getCustomTasks); //Done

router.post("/custom-tasks",Auth,UserController.setCustomTask); //Done

router.put("/custom-tasks/edit",Auth,UserController.editCustomTask); //Done

router.get("/custom-tasks/done",Auth,UserController.doneCustomTask); //Done

router.delete("/custom-tasks/delete",Auth,UserController.deleteCustomTask); //Done

router.get("/pins",Auth,UserController.getPins); //Done

module.exports = router;