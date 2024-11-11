require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const Product = require("./src/module/products");
const Order = require("./src/module/orders");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tushartraders.shop"],
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

// User Registration

// app.post("/api/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // User Login

// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).json({ message: "User not found" });

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid)
//     return res.status(400).json({ message: "Invalid password" });

//   const token = jwt.sign({ id: user._id, email: user.email }, "Tushar@0945", {
//     expiresIn: "10d",
//   });

//   res
//     .cookie("access-token", token, {
//       httpOnly: true,
//       maxAge: 86400000,
//     })
//     .status(200)
//     .json(user);
// });

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
