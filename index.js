const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/user.route")
const productRouter = require("./routes/product.route")
const adminRouter = require("./routes/admin.route");
const cartRoute = require("./routes/cart.route");
const { Logger } = require("./middlewares/logger");
const { auth } = require("./middlewares/auth");
const wishlistRoute = require("./routes/wishlist.route");
const bannedRoutes = require("./routes/banuserroute");
const { adminOrderRoute } = require("./routes/admin.order.route");
require("dotenv").config();

const app = express();
app.use(cors({
  origin : "*",
}));
app.use(express.json());

app.use("/user", userRouter)
app.use("/admin",adminRouter)
app.use("/product", productRouter)
app.use("/adminorder",adminOrderRoute)
app.use(auth)
app.use("/wishlist",wishlistRoute)
app.use("/cart",cartRoute)
app.use("/banneduser",bannedRoutes)
app.get("/", (req, res) => {
  res.status(200).send("Home page");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to Mongo Atlas");
  } catch (err) {
    console.log(err)
    console.log("Couldn't connect to Mongo Atlas");
  }
  console.log(`Server started on port ${process.env.port}`);
});
