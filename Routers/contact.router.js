const express = require("express");
const { create, list } = require("../Controllers/contact.comtrollers");
const router = express.Router();
const verifToken = require("../Middleware/auth");


router.post("/contact", create);
router.get("/contact",verifToken, list);

module.exports = router;
