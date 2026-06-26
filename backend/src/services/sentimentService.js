const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const analyzePosts = (posts) => {
    return posts.map(post => {

        const text = `${post.title || ""} ${post.text || ""}`;

        const result = sentiment.analyze(text);

        let label = "neutral";

        if (result.score > 0) label = "positive";
        if (result.score < 0) label = "negative";

        return {
            ...post,
            score: result.score,
            sentiment: label
        };
    });
};

module.exports = {
    analyzePosts
};