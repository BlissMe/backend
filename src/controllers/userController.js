const userService = require("../services/userService");

const setPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("Setting preferences for user controller:", userId);
        const { nickname, virtualCharacter, inputMode } = req.body;

        const user = await userService.setInitialPreferences(userId, {
            nickname,
            virtualCharacter,
            inputMode
        });

        res.status(200).json({ message: "Preferences set successfully", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateNickname = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { nickname } = req.body;

        const user = await userService.updateNickname(userId, nickname);
        res.status(200).json({ message: "Nickname updated", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateVirtualCharacter = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { virtualCharacter } = req.body;

        const user = await userService.updateVirtualCharacter(userId, virtualCharacter);
        res.status(200).json({ message: "Virtual character updated", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateInputMode = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { inputMode } = req.body;

        if (!["voice", "text"].includes(inputMode)) {
            return res.status(400).json({ message: "Invalid input mode" });
        }

        const user = await userService.updateInputMode(userId, inputMode);
        res.status(200).json({ message: "Input mode updated", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;

        const preferences = await userService.getUserPreferences(userId);

        res.status(200).json({
            message: "User preferences fetched successfully",
            preferences,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = {
    setPreferences,
    updateNickname,
    updateVirtualCharacter,
    updateInputMode,
    getPreferences
};
