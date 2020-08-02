const router = require("express").Router();
const auth = require('../../middleware/auth')
const { postAddProduct } = require("../../controllers/admin/products");

router.route("/add-product").post(auth, postAddProduct);

module.exports = router;
