const express = require("express");
const {
  post,
  getList,
  patch,
  remove,
  getById,
} = require("../Controllers/product.controller");
const router = express.Router();
const multer = require("multer");
const verifToken = require("../Middleware/auth");
const storage = multer.memoryStorage();
const uploadImages = multer({ storage });

router.get("/product", getList);
router.get("/product/:id", getById);
router.post("/product", verifToken, uploadImages.array("PD_image"), post);
router.patch("/product/:id", verifToken, uploadImages.array("PD_image"), patch);
router.delete("/product/:id", verifToken, remove);

module.exports = router;
