const express = require("express");
const { createUser, getSingleUser } = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/").get(getSingleUser);

module.exports = router;
