const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const dbConnect = require("./db/Connection");
const userRouter = require("./Routes/UserRoute");
const blogRouter = require("./Routes/BlogRoutes");

app.use(express.json());
app.use(cors());

// Database connection
dbConnect();

// Routers
// For User Registration and Login
app.use("/api/user", userRouter);
// For Blogs
app.use("/api/blog", blogRouter);

// app.get("/", (req, res) => {
//   res.send("Server running");
// });

app.listen(port, (req, res) => {
  console.log(`Server running at port: ${port}`);
});
