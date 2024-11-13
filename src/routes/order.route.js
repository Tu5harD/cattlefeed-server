const express = require("express");
const {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
