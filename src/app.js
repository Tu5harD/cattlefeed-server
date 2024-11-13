const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
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
