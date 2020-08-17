const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  billing: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    postalCode: { type: String, required: true },
    orderNotes: { type: String },
    country: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
});

module.exports = mongoose.model("Order", orderSchema);
