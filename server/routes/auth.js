const express = require("express");
const AuthController = require("../controllers/AuthController");
const verifyUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/logout", verifyUser, AuthController.logout);

module.exports = router;