const router = require("express").Router();
const userRoutes = require("./UserRoutes");
const adminRoutes = require("./AdminRoutes");
const authRoutes = require("./AuthRoutes");
const logRoutes = require("./LogRoutes")

router.use("/auth",authRoutes);
router.use("/user",userRoutes);
router.use("/admin",adminRoutes);
router.use("/log",logRoutes);

module.exports = router;