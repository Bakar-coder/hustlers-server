const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: "String", required: true },
  description: { type: "String", required: true },
  file: { type: "String", required: true },
  createdAt: { type: "Date", default: Date.now },
});

const validatePhoto = (product) => {
  const schema = {
    title: Joi.string().required(),
    description: Joi.string().required(),
  };

  return Joi.validate(product, schema);
};

exports.Photo = mongoose.model("Photo", productSchema);
exports.validatePhoto = validatePhoto;
