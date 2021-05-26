const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const promoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  expDate: { type: "Date", required: true },
  title: { type: "String", required: true },
  description: { type: "String", required: true },
  file: { type: "String", required: true },
  createdAt: { type: "Date", default: Date.now },
});

const validatePromotion = (media) => {
  const schema = {
    expDate: Joi.date().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  };

  return Joi.validate(media, schema);
};

exports.Promotion = mongoose.model("Promotion", promoSchema);
exports.validatePromotion = validatePromotion;
