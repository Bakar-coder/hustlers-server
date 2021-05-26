const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const { Product } = require("../../models/Product");
const Order = require("../../models/Order");
const { User } = require("../../models/User");

exports.getCart = async (req, res) => {
  let user = await User.findById(req.user.id);
  const products = user.cart.items;
  return res.json({ success: true, products });
};

exports.postCart = async (req, res) => {
  const prodId = req.body._id;
  const product = await Product.findById(prodId);
  if (product) {
    const user = await User.findById(req.user.id);
    if (user) {
      const result = await user.addToCart(product);
      return res.json({
        success: true,
        msg: `added ${product.title} to cart`,
        cart: result.items,
      });
    }
  }
};

exports.postDecrementCartItem = async (req, res) => {
  const { _id } = req.body;
  const product = await Product.findById(_id);
  if (product) {
    const user = await User.findById(req.user.id);
    if (user) {
      const result = await user.decrementCartItem(product);
      return res.json({
        success: true,
        cart: result,
      });
    }
  }
};

exports.postCartDeleteProduct = async (req, res) => {
  const prodId = req.body._id;
  const user = await User.findById(req.user.id);

  const result = await user.removeFromCart(prodId);
  if (result)
    return res.json({
      success: true,
      msg: "removed product from cart",
      cart: result,
    });
};

exports.postClearCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    const result = await user.clearCart();
    return res.json({
      success: true,
      msg: "cleared cart successfully",
      cart: result.cart.items,
    });
  }
};

exports.postOrder = async (req, res) => {
  const billing = req.body;
  const user = await await (await User.findById(req.user.id))
    .populate("cart.items.productId")
    .execPopulate();
  if (user) {
    const products = user.cart.items.map((item) => {
      return { quantity: item.quantity, product: { ...item.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user.id,
      },
      products,
      billing,
    });

    await order.save();
    await user.clearCart();
    return res.json({
      success: true,
      msg: "Your order as been submitted successfully",
      order,
    });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ "user.userId": req.user.id });
  if (orders) return res.json({ success: true, orders });
};

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.body;
  await Order.findByIdAndDelete(orderId);
  const orders = await Order.find();
  return res.json({ success: true, msg: "order removed successfully", orders });
};

exports.getInvoice = async (req, res) => {
  const orderId = req.body._id;
  const order = await Order.findById(orderId);
  if (!order)
    return res.status(400).json({ success: true, msg: "No order found." });
  if (order.user.userId.toString() !== req.user.id.toString())
    return res.status(400).json({ success: true, msg: "Unauthorized" });
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join("data", "invoices", invoiceName);
  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + invoiceName + '"'
  );
  res.setHeader("X-SendFile", `${invoiceName}`);
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  pdfDoc.fontSize(26).text("Invoice", {
    underline: true,
  });
  pdfDoc.text("-----------------------");
  let totalPrice = 0;
  order.products.forEach((prod) => {
    totalPrice += prod.quantity * prod.product.price;
    pdfDoc
      .fontSize(14)
      .text(
        prod.product.title +
          " - " +
          prod.quantity +
          " x " +
          "$" +
          prod.product.price
      );
  });
  pdfDoc.text("---");
  pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

  pdfDoc.end();
};
