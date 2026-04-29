const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

module.exports = router;