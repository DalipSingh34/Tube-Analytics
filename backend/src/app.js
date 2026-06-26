const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const sentimentRoutes = require("./routes/sentimentRoutes.js");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.use("/api/history", historyRoutes);

module.exports = app;