const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  updateProducts,
} = require("../controllers/shopController");

const router = express.Router();

router.route("/allProducts").get(getAllProducts);
router.route("/singleProduct").post(getSingleProduct);
router.route("/updateProduct").patch(updateProducts);

module.exports = router;
