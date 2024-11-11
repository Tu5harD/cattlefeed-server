const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  imageurl: {
    type: String,
  },
  weight: {
    type: String,
  },
  application: {
    type: String,
  },
  productform: {
    type: String,
  },
  packaging: {
    type: String,
  },
  location: {
    type: String,
    default: "इंगरुळ ता - शिराळा, जि - सांगली.",
  },
  dosage: {
    type: String,
  },
  like: {
    type: Number,
    default: 300,
  },
});

module.exports = mongoose.model("Product", schema);
