const express = require("express");
const {
  reservationController,
} = require("../controllers/reservationController");

const router = express.Router();

//making reservations and sending out kafka message to the topic
//create order and store order in database
//checkout
router.route("/").post(reservationController);

module.exports = router;
