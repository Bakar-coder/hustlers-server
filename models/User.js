const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const Schema = mongoose.Schema;
const Jwt = require("jsonwebtoken");

const userSchema = new Schema({
  firstName: { type: "String", required: true },
  lastName: { type: "String", required: true },
  username: { type: "String", required: true, unique: true },
  email: { type: "String", required: true, unique: true },
  avatar: { type: "String", required: true },
  password: { type: "String", required: true, min: 8, max: 25 },
  admin: { type: "Boolean", required: false },
  stuff: { type: "Boolean", default: false },
  active: { type: "Boolean", default: false },
  createdAt: { type: "Date", default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    admin: this.admin,
    stuff: this.stuff,
    active: this.active,
  };

  return Jwt.sign(payload, config.get("jwtPrivateKey"), { expiresIn: 3600 });
};

const validateRegister = (user) => {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    avatar: Joi.boolean(),
    password: Joi.string().required().min(8).max(25),
    admin: Joi.boolean(),
    stuff: Joi.boolean(),
    active: Joi.boolean(),
  };

  return Joi.validate(user, schema);
};

const validateLogin = (user) => {
  const schema = {
    email: Joi.string(),
    password: Joi.string().required(),
  };

  return Joi.validate(user, schema);
};

exports.User = mongoose.model("User", userSchema);
exports.validateLogin = validateLogin;
exports.validateRegister = validateRegister;
