const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
const corsOptions = {
  origin: "https://www.tushartraders.shop",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

module.exports = app;
