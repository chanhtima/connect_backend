const express = require("express");
const {
  postNews,
  getList,
  update,
  removeNews,
  getById,
} = require("../Controllers/news.controllers");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadImages = multer({ storage });
const route = express.Router();

route.post("/news", uploadImages.array("NE_image"), postNews);
route.patch("/news/:id", uploadImages.array("NE_image"), update);
route.delete("/news/:id", removeNews);
route.get("/news/:id", getById);
route.get("/news", getList);

module.exports = route;
