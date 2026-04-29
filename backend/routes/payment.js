const express = require("express");
const router = express.Router();

/* CREATE ORDER */
router.post("/create-order", (req, res) => {
  const { amount } = req.body;

  const orderId = "ORDER_" + Date.now();
  const txnId = "TXN_" + Math.floor(Math.random() * 1000000);

  // ✅ FIXED: correct port + correct route
  const paytmUrl = `http://localhost:5000/api/payment/paytm-mock?orderId=${orderId}&amount=${amount}&txnId=${txnId}`;

  res.json({
    success: true,
    orderId,
    txnId,
    paytmUrl
  });
});

/* PAYTM MOCK */
router.get("/paytm-mock", (req, res) => {
  const { orderId, amount, txnId } = req.query;

  res.send(`
    <html>
      <body style="font-family: Arial; text-align:center; margin-top:80px;">
        <h2>💳 Paytm Mock Payment</h2>
        <p>Order ID: ${orderId}</p>
        <p>Amount: ₹${amount}</p>

        <button 
          style="padding:10px 20px; font-size:16px; cursor:pointer;"
          onclick="window.location.href='http://localhost:3000/success?orderId=${orderId}&txnId=${txnId}&amount=${amount}'"
        >
          ✅ Pay Now
        </button>
      </body>
    </html>
  `);
});

module.exports = router;