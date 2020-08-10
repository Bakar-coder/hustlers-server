const auth = require("../middleware/auth");
const router = require("express").Router();
const {
  getCart,
  postCart,
  postCartDeleteProduct,
  getCheckout,
  postOrder,
  getOrders,
  getInvoice,
  postDecrementCartItem,
  postClearCart,
} = require("../controllers/products/shop");
router.route("/cart").get(auth, getCart).post(auth, postCart);
router.route("/delete-cart-item").post(auth, postCartDeleteProduct);
router.route("/cart-decrement").post(auth, postDecrementCartItem);
router.route("/cart-clear").post(auth, postClearCart);
router.route("/checkout").get(auth, getCheckout);
router.route("/orders").get(getOrders).post(auth, postOrder);
router.route("/invoice").get(getInvoice);
module.exports = router;
