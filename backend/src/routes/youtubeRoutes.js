const express = require("express");
const router = express.Router();
const { getYouTubeComments } = require("../services/ytService");

router.get("/comments", async (req, res) => {
    try {
        const { videoId } = req.query;

        const data = await getYouTubeComments(videoId);

        res.json({ success: true, data });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;