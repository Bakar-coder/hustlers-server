const { Product, validateProduct } = require("../../models/Product");
const { fileFilter, deleteFile } = require("../../utils/file");
let path;
let coverPath;

// Post admin add product
exports.postAddProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  let { file, cover } = req.files;
  const { title, description, price, category, published, featured } = req.body;
  path = fileFilter(res, file);
  if (cover) coverPath = `media/images/${Date.now() + "_" + cover.name}`;
  const imageSize = 1024 * 1024 * 5;
  if (cover.size > imageSize)
    return res
      .status(400)
      .json({ success: false, msg: "Image file size should not exide 5Mbs" });

  const [filePath] = path && path.filter((route) => route);

  let product = await Product.findOne({ title });
  if (product)
    return res.status(400).json({
      success: false,
      msg: `Product with the title ${title} already exists`,
    });

  await file.mv(`${filePath}`);
  await cover.mv(`${coverPath}`);

  product = new Product({
    user: req.user.id,
    title,
    description,
    category,
    price,
    file: filePath,
    cover: coverPath,
    published,
    featured,
  });
  await product.save();
  return res.json({ success: true, msg: `${title} added successfully.` });
};

// Post admin edit product
exports.postAdminEditProduct = async (req, res) => {
  if (req.user.admin) {
    const { title, description, price, category, _id } = req.body;
    const productId = Number(_id);
    const { file, cover } = req.files;
    const fileSize = 1024 * 1024 * 1024 * 1024 * 2;
    if (file && file.size > fileSize)
      return res
        .status(400)
        .json({ success: false, msg: "file size must not exceed 2Gb" });
    const coverSize = 1024 * 1024 * 5;
    if (cover && cover.size > coverSize)
      return res
        .status(400)
        .json({ success: false, msg: "Cover size must not exceed 5Mb" });

    const product = await Product.findOne({ _id: productId });
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (featured) product.featured = featured;
    if (published) product.published = published;
    if (file) {
      deleteFile(`${product.file}`);
      product.file = Date.now() + "_" + file.name;
    }
    if (cover) {
      deleteFile(`${product.cover}`);
      product.cover = Date.now() + "_" + cover.name;
    }
    await product.save();
    return res.json({
      success: true,
      msg: `updated ${product.title} successfully.`,
    });
  }
};

// Post admin delete product
exports.postAdminDeleteProduct = async function (req, res) {
  if (req.user.admin) {
    const { _id } = req.body;
    const product = await Product.findById(_id);
    await Product.findByIdAndDelete(_id);
    deleteFile(`${product.file}`);
    deleteFile(`${product.cover}`);
    return res.json({
      success: true,
      msg: `deleted ${product.title} successfully.`,
    });
  }
};