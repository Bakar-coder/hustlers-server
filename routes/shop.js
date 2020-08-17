const auth = require("../middleware/auth");
const router = require("express").Router();
const { momopay } = require("../controllers/admin/pyment-gate-way");
const {
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
  getInvoice,
  postDecrementCartItem,
  postClearCart,
  deleteOrder,
} = require("../controllers/products/shop");
router.route("/cart").get(auth, getCart).post(auth, postCart);
router.route("/pay").post(auth, momopay);
router.route("/delete-cart-item").post(auth, postCartDeleteProduct);
router.route("/cart-decrement").post(auth, postDecrementCartItem);
router.route("/cart-clear").post(auth, postClearCart);
router.route("/orders").get(auth, getOrders).post(auth, postOrder);
router.route("/orders/delete-order").post(auth, deleteOrder);
router.route("/invoice").get(getInvoice);
module.exports = router;
