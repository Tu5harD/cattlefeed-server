const Order = require("../module/orders");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
