const cleanText = (text = "") => {
    return text
        .replace(/<[^>]*>/g, "")
        .replace(/&/g, "&")
        .replace(/'/g, "'")
        .replace(/"/g, '"')
        .trim();
};

const { analyzePosts } = require("../services/sentimentService");
const { calculateStats } = require("../services/analyticsService");
const { getYouTubeComments } = require("../services/ytServices");
const { SearchHistory } = require("../models/SearchHistory");

const getSentiment = async (req, res) => {
    try {
        const { videoId, order } = req.query;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "videoId required"
            });
        }

        const ytData = await getYouTubeComments(
            videoId,
            order || "relevance"
        );

        const ytComments = ytData.comments || [];

        const youtubeData = ytComments.map((c) => ({
            source: "youtube",
            title: c.author,
            text: cleanText(c.text),
            likes: c.likes,
            publishedAt: c.publishedAt
        }));

        const youtubeAnalyzed = analyzePosts(youtubeData);

        let finalComments = youtubeAnalyzed;

        const youtubeStats = calculateStats(youtubeAnalyzed);

        const totalLikes = youtubeAnalyzed.reduce(
            (acc, item) => acc + (item.likes || 0),
            0
        );

        await SearchHistory.findOneAndUpdate(
            {
                userId: req.user._id,
                keyword: videoId
            },
            {
                $set: {
                    videoTitle: ytData.videoTitle,
                    source: "youtube",
                    totalPosts: youtubeStats.totalPosts,
                    positive: youtubeStats.positive,
                    negative: youtubeStats.negative,
                    neutral: youtubeStats.neutral,
                    createdAt: new Date()
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        console.log(ytData.totalSubscribers);

        return res.status(200).json({
            success: true,

            videoTitle: ytData.videoTitle,
            totalSubscribers: ytData.totalSubscribers,
            totalViews: ytData.totalViews,
            totalLikes: ytData.totalLikes,
            totalComments: ytData.totalComments,

            stats: youtubeStats,

            totalLikes,

            comments: finalComments,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Sentiment analysis failed",
            error: error.message
        });
    }

};

module.exports = { getSentiment };
