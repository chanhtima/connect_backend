const express = require("express");
const app = express();
const port = 3000;
const connectDB = require('./config/db.js') 
const {readdirSync } =require('fs')
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api/images", express.static("images"));
// mongoDB
connectDB()

// routers
readdirSync("./Routers").map((r) => app.use("/api", require("./Routers/" + r)));


app.listen(port, () => {
  console.log(`Server is Running on port : http://localhost:${port}`);
});
