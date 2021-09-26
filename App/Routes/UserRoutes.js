const router = require("express").Router();
const Auth = require( "../http/middlewares/Auth");
const UserController =require( "../http/Controller/UserController");

router.get("/profile",Auth,UserController.getProfile); //unfinished //! awaiting tests--------------------------------

router.get("/logout",Auth,UserController.logout); //unfinished

router.post("/delete-account",Auth,UserController.deleteAccount); //unfinished //! awaiting tests---------------------

router.put("/change-info",Auth,UserController.changeInfo); //unfinished

router.post("/change-password",Auth,UserController.changePassword); //check for Bugs //? why post method?

router.get("/tasks",Auth,UserController.getTasks); //unfinished //! awaiting tests -----------------------------------

router.get("/tasks/done?task=",Auth,UserController.doneTask); //unfinished //! awaiting tests ------------------------

router.get("/tasks/delay?task=",Auth,UserController.delayTask); //unfinished //! awaiting tests ----------------------

router.get("/custom-tasks",Auth,UserController.getCustomTasks); //unfinished //! awaiting tests-----------------------

router.post("/custom-tasks",Auth,UserController.setCustomTask); //unfinished //! awaiting tests-----------------------

router.put("/custom-tasks/edit?task=",Auth,UserController.editCustomTask); //unfinished //! awaiting tests------------

router.get("/custom-tasks/done?task=",Auth,UserController.doneCustomTask); //unfinished  //! awaiting tests------------

router.delete("/custom-tasks/delete?task=",Auth,UserController.deleteCustomTask); //unfinished //! awaiting tests-----

router.get("/pins",Auth,UserController.getPins); //looks fine, check for Bugs

module.exports = router;