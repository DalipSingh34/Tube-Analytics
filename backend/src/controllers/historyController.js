const { SearchHistory } = require("../models/SearchHistory");

const getHistory = async (req, res) => {
    try {
        const history = await SearchHistory
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            getHistory: history
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getHistory };