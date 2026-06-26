const calculateStats = (posts) => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    posts.forEach(post => {
        if (post.sentiment === "positive") positive++;
        else if (post.sentiment === "negative") negative++;
        else neutral++;
    });

    return {
        totalPosts: posts.length,
        positive,
        negative,
        neutral
    };
};

module.exports = {
    calculateStats
};