const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  name: String,
  price: Number,
  vendor: String,
  qty: Number,
});

module.exports = mongoose.model("Cart", cartSchema);