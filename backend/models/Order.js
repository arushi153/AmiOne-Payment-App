const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  amount: Number,
  status: String,
  user: String,
});

module.exports = mongoose.model("Order", orderSchema);