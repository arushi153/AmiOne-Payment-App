const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

/* ADD TO CART */
router.post("/add", async (req, res) => {
  try {
    const { name, price, vendor } = req.body;

    console.log("🛒 Add Request:", req.body);

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Invalid item data",
      });
    }

    // ✅ FIX: include vendor in search (prevents mixing items)
    let item = await Cart.findOne({ name, vendor });

    if (item) {
      item.qty += 1;
      await item.save();
    } else {
      item = new Cart({
        name,
        price: Number(price),
        vendor,
        qty: 1,
      });
      await item.save();
    }

    const cart = await Cart.find();

    res.json({
      success: true,
      message: "Item added",
      cart,
    });

  } catch (err) {
    console.error("❌ Add Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding item",
    });
  }
});

/* GET CART */
router.get("/get", async (req, res) => {
  try {
    const cart = await Cart.find();

    res.json({
      success: true,
      cart,
    });

  } catch (err) {
    console.error("❌ Get Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
});

/* REMOVE ITEM */
router.post("/remove", async (req, res) => {
  try {
    const { name, vendor } = req.body;

    let item = await Cart.findOne({ name, vendor });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.qty > 1) {
      item.qty -= 1;
      await item.save();
    } else {
      await Cart.deleteOne({ name, vendor });
    }

    const cart = await Cart.find();

    res.json({
      success: true,
      message: "Item removed",
      cart,
    });

  } catch (err) {
    console.error("❌ Remove Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error removing item",
    });
  }
});

/* CLEAR CART */
router.post("/clear", async (req, res) => {
  try {
    await Cart.deleteMany();

    res.json({
      success: true,
      message: "Cart cleared",
    });

  } catch (err) {
    console.error("❌ Clear Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
});

module.exports = router;