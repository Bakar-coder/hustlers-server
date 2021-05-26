const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: "String", required: true },
  stock: { type: "Number", required: true },
  description: { type: "String", required: true },
  category: { type: "String", required: true },
  price: { type: "Number", required: true },
  file: { type: "String", required: true },
  featured: { type: "Boolean", default: true },
  published: { type: "Boolean", default: true },
  createdAt: { type: "Date", default: Date.now },
});

const validateProduct = (product) => {
  const schema = {
    title: Joi.string().required(),
    stock: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    featured: Joi.boolean(),
    published: Joi.boolean(),
  };

  return Joi.validate(product, schema);
};

exports.Product = mongoose.model("Product", productSchema);
exports.validateProduct = validateProduct;
