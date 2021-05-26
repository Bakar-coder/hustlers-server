const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: "Date", required: true },
  title: { type: "String", required: true },
  venue: { type: "String", required: true },
  description: { type: "String", required: true },
  file: { type: "String", required: true },
  createdAt: { type: "Date", default: Date.now },
});

const validateEvent = (media) => {
  const schema = {
    date: Joi.date().required(),
    title: Joi.string().required(),
    venue: Joi.string().required(),
    description: Joi.string().required(),
  };

  return Joi.validate(media, schema);
};

exports.Event = mongoose.model("Event", eventSchema);
exports.validateEvent = validateEvent;
