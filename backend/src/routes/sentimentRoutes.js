const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { getSentiment } = require("../controllers/sentimentController");

router.get("/", protect, getSentiment);

module.exports = router;