const router = require("express").Router();
const userRoutes = require("./UserRoutes");
const adminRoutes = require("./AdminRoutes")

router.use("/user",userRoutes);
router.use("/admin",adminRoutes);

module.exports = router;