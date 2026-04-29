const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// 📊 GET BUDGET DATA
router.get("/data", async (req, res) => {
  try {
    // 🧠 Fetch all payments
    const payments = await Payment.find().sort({ createdAt: -1 });

    // 🗓️ Last 7 days filter
    const now = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(now.getDate() - 7);

    const lastWeekPayments = payments.filter(
      (p) => new Date(p.createdAt) >= lastWeekDate
    );

    // 💰 Last week total
    const lastWeek = lastWeekPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    // 🤖 Prediction (basic avg model)
    const days = 7;
    const avgPerDay = lastWeek / days;
    const predicted = Math.round(avgPerDay * 7);

    // 📋 Latest transactions (limit 10)
    const transactions = payments.slice(0, 10).map((p) => ({
      orderId: p.orderId,
      amount: Number(p.amount || 0),
      date: p.createdAt
    }));

    res.json({
      success: true,
      lastWeek,
      predicted,
      transactions,
    });

  } catch (err) {
    console.error("❌ Budget Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching budget data",
    });
  }
});

module.exports = router;