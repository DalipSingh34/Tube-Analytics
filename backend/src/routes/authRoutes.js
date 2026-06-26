const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController.js");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

router.get("/oauth/callback", (req, res) => {
    res.send("OAuth callback reached");
});

module.exports = router;