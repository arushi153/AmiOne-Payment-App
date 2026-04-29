const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

/* =========================
   1. CREATE ORDER
========================= */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const orderId = "ORDER_" + Date.now();
    const txnId = "TXN_" + Math.floor(Math.random() * 1000000);

    // Save order in DB
    await Payment.create({
      orderId,
      txnId,
      amount,
      status: "PENDING",
    });

    const paytmUrl = `http://localhost:5050/payment/paytm-mock?orderId=${orderId}&amount=${amount}&txnId=${txnId}`;

    res.json({
      success: true,
      orderId,
      txnId,
      paytmUrl,
    });

  } catch (err) {
    console.log("❌ CREATE ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   2. PAYTM MOCK PAGE
========================= */
router.get("/paytm-mock", (req, res) => {
  const { orderId, amount, txnId } = req.query;

  res.send(`
    <html>
      <body style="font-family: Arial; text-align:center; margin-top:80px;">
        <h2>💳 Paytm Mock Payment</h2>
        <p>Order ID: ${orderId}</p>
        <p>Amount: ₹${amount}</p>

        <button onclick="window.location.href='http://localhost:5050/payment/success?orderId=${orderId}&txnId=${txnId}&amount=${amount}'">
          ✅ Pay Success
        </button>

        <br/><br/>

        <button onclick="window.location.href='http://localhost:5050/payment/failure?orderId=${orderId}&txnId=${txnId}&amount=${amount}'">
          ❌ Pay Fail
        </button>
      </body>
    </html>
  `);
});

/* =========================
   3. SUCCESS CALLBACK
========================= */
router.get("/success", async (req, res) => {
  try {
    const { orderId, txnId, amount } = req.query;

    await Payment.findOneAndUpdate(
      { orderId },
      { status: "SUCCESS" }
    );

    res.redirect(
      `http://localhost:61736/success?orderId=${orderId}&txnId=${txnId}&amount=${amount}`
    );

  } catch (err) {
    console.log("❌ SUCCESS ERROR:", err);
    res.send("Error processing payment success");
  }
});

/* =========================
   4. FAILURE CALLBACK
========================= */
router.get("/failure", async (req, res) => {
  try {
    const { orderId } = req.query;

    await Payment.findOneAndUpdate(
      { orderId },
      { status: "FAILED" }
    );

    res.send(`
      <html>
        <body style="text-align:center; margin-top:80px;">
          <h2>❌ Payment Failed</h2>
          <a href="http://localhost:61736/">Go Back</a>
        </body>
      </html>
    `);

  } catch (err) {
    console.log("❌ FAILURE ERROR:", err);
    res.send("Error processing failure");
  }
});

/* =========================
   5. VERIFY PAYMENT
========================= */
router.post("/verify", async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      status: payment.status,
    });

  } catch (err) {
    console.log("❌ VERIFY ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   6. GET PAYMENT STATUS
========================= */
router.get("/status/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({
      orderId: req.params.orderId,
    });

    if (!payment) {
      return res.json({ success: false });
    }

    res.json({
      orderId: payment.orderId,
      status: payment.status,
      amount: payment.amount,
    });

  } catch (err) {
    console.log("❌ STATUS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;