const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema);