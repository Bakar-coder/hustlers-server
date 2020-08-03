const router = require("express").Router();
const auth = require("../../middleware/auth");
const {
  postAddProduct,
  postAdminEditProduct,
  postAdminDeleteProduct,
} = require("../../controllers/admin/products");

router.route("/add-product").post(auth, postAddProduct);
router.route("/edit-product").post(auth, postAdminEditProduct);
router.route("/delete-product").post(auth, postAdminDeleteProduct);

module.exports = router;
