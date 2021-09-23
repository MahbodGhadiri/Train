const router = require("express").Router();
const userRoutes = require("./UserRoutes");
const adminRoutes = require("./AdminRoutes");
const authRoutes = require("./AuthRoutes");

router.use("/auth",authRoutes);
router.use("/user",userRoutes);
router.use("/admin",adminRoutes);

module.exports = router;