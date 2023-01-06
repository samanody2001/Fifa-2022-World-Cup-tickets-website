const express = require("express");
const {
  getSingleClientOrders,
  checkout,
  confirmPayment,
  showStats,
} = require("../controllers/orderController");

const router = express.Router();

router.route("/getOrders").get(getSingleClientOrders);
router.route("/checkout").post(checkout);
router.route("/webhook").post(confirmPayment);
router.route("/showStats").post(showStats);
module.exports = router;
