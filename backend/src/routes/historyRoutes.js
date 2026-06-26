const { getHistory } = require("../controllers/historyController.js");
const protect = require("../middleware/authMiddleware.js");
const express = require("express");

const router = express.Router();

router.get("/", protect, getHistory);

module.exports = router;