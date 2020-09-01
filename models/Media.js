const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: "String", required: true },
  artist: { type: "String", required: true },
  genre: { type: "String", required: true },
  releaseDate: { type: "Date", required: true },
  description: { type: "String", required: true },
  category: { type: "String", required: true },
  file: { type: "String", required: true },
  type: { type: "String", required: true },
  cover: { type: "String", required: true },
  featured: { type: "Boolean", default: true },
  published: { type: "Boolean", default: true },
  createdAt: { type: "Date", default: Date.now },
});

const validateMedia = (media) => {
  const schema = {
    title: Joi.string().required(),
    artist: Joi.string().required(),
    genre: Joi.string().required(),
    releaseDate: Joi.date().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    featured: Joi.boolean(),
    published: Joi.boolean(),
  };

  return Joi.validate(media, schema);
};

exports.Media = mongoose.model("Media", mediaSchema);
exports.validateMedia = validateMedia;
