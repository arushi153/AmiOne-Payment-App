const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: String,
  txnId: String,
  amount: Number,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);