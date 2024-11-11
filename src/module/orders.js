const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  product: {
    type: String,
  },
  weight: {
    type: String,
  },
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  quantity: {
    type: String,
  },
  date: {
    type: String,
  },
  status: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Order", schema);
