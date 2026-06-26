const axios = require("axios");

const getYouTubeComments = async (videoId, order = "relevance") => {

    const commentsResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        {
            params: {
                part: "snippet",
                videoId,
                maxResults: 20,
                order,
                key: process.env.YT_API_KEY
            }
        }
    );

    const videoResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
            params: {
                part: "snippet,statistics",
                id: videoId,
                key: process.env.YT_API_KEY
            }
        }
    );

    const items = commentsResponse.data.items || [];

    const video = videoResponse.data.items?.[0] || {};

    const channelId = video.snippet?.channelId;

    const channelResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        {
            params: {
                part: "statistics",
                id: channelId,
                key: process.env.YT_API_KEY
            }
        }
    );

    const channel =
        channelResponse.data.items?.[0] || {};

    const comments = items.map(item => ({
        id: item.id,
        text:
            item.snippet.topLevelComment.snippet.textOriginal ||
            item.snippet.topLevelComment.snippet.textDisplay,
        author:
            item.snippet.topLevelComment.snippet.authorDisplayName,
        likes:
            item.snippet.topLevelComment.snippet.likeCount,
        publishedAt:
            item.snippet.topLevelComment.snippet.publishedAt,
        source: "youtube"
    }));

    return {
        comments,
        videoTitle: video.snippet?.title || `YouTube Video ${videoId}`,
        totalSubscribers:
            Number(channel.statistics?.subscriberCount || 0),
        totalLikes: Number(video.statistics?.likeCount || 0),
        totalViews: Number(video.statistics?.viewCount || 0),
        totalComments: Number(video.statistics?.commentCount || 0)
    };
};

module.exports = { getYouTubeComments };