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
  member: { type: "Boolean", default: false },
  active: { type: "Boolean", default: false },
  createdAt: { type: "Date", default: Date.now },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    cart: this.cart,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    admin: this.admin,
    stuff: this.stuff,
    member: this.member,
    active: this.active,
    resetToken: this.resetToken,
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
    member: Joi.boolean(),
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

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  this.save();
  return this.cart;
};

userSchema.methods.decrementCartItem = function (product) {
  const cartProduct = this.cart.items.find(
    (cp) => cp.productId.toString() === product._id.toString()
  );

  if (cartProduct.quantity > 1) cartProduct.quantity -= 1;
  this.save();
  return cartProduct;
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  this.save();
  return this.cart.items;
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  this.save();
  return this.cart;
};

exports.User = mongoose.model("User", userSchema);
exports.validateLogin = validateLogin;
exports.validateRegister = validateRegister;
