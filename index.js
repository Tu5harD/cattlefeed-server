require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const Product = require("./src/module/products");
const Order = require("./src/module/orders");
const cors = require("cors");
const app = express();

connectDB();

app.use(express.json());
// const allowedOrigins = ["https://tushartraders.shop", "http://localhost:5173"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Check if the incoming origin is in the allowedOrigins array or if it’s undefined (for server-to-server requests)
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "10mb" }));
app.get("/api/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findById(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findByIdAndDelete(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/upload", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const products = await Order.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const upDateProduct = req.body;
    const response = await Product.findByIdAndUpdate(id, upDateProduct, {
      new: true,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const upDateOrder = req.body;

    const response = await Order.findByIdAndUpdate(id, upDateOrder, {
      new: true,
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
