const { Product, validateProduct } = require("../../models/Product");
const { fileFilter, deleteFile } = require("../../utils/file");
let path;

// Post admin add product
exports.postAddProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  let { file } = req.files;
  const {
    title,
    stock,
    description,
    price,
    category,
    published,
    featured,
  } = req.body;
  path = fileFilter(res, file);
  const [filePath] = path && path.filter((route) => route);

  let product = await Product.findOne({ title });
  if (product)
    return res.status(400).json({
      success: false,
      msg: `Product with the title ${title} already exists`,
    });

  product = new Product({
    user: req.user.id,
    title,
    stock,
    description,
    price,
    category,
    published,
    featured,
    file: filePath,
  });
  await product.save();
  await file.mv(`${filePath}`);
  return res.json({ success: true, msg: `${title} added successfully.` });
};

// Post admin edit product
exports.postAdminEditProduct = async (req, res) => {
  if (req.user.stuff) {
    const {
      title,
      description,
      price,
      category,
      featured,
      published,
    } = req.body;
    const productId = req.body.id;
    let file;

    if (req.files && req.files.file) {
      file = req.files.file;
      path = fileFilter(res, file);
    }

    const product = await Product.findOne({ _id: productId });
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (featured) product.featured = featured;
    if (published) product.published = published;
    if (file) {
      const [filePath] = path && path.filter((route) => route);
      deleteFile(`${product.file}`);
      product.file = filePath;
      await file.mv(`${filePath}`);
    }

    await product.save();
    return res.json({
      success: true,
      msg: `updated ${product.title} successfully.`,
      product,
    });
  }
};

// Post admin delete product
exports.postAdminDeleteProduct = async function (req, res) {
  if (req.user.stuff) {
    const { _id } = req.body;
    const product = await Product.findById(_id);
    await Product.findByIdAndDelete(_id);
    deleteFile(`${product.file}`);
    return res.json({
      success: true,
      msg: `deleted ${product.title} successfully.`,
    });
  }
};
