const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUpForm);
router.post("/users/sign_up", validation.validateUsers, userController.create);


module.exports = router;