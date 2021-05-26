const { Product } = require("../../models/Product");
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  return res.json({ success: true, products })
};
