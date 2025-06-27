const User = require("../models/userModel");
const { encryptText } = require("../utils/encryption");

const setInitialPreferences = async (userId, { nickname, virtualCharacter, inputMode }) => {
    const user = await User.findOne({ userID: userId });

    if (!user) throw new Error("User not found");

    if (user.nickname || user.virtualCharacter !== "cat" || user.inputMode !== "text") {
        throw new Error("Preferences already set");
    }

    user.nickname = encryptText(nickname);
    user.virtualCharacter = encryptText(virtualCharacter);
    user.inputMode = encryptText(inputMode);

    return await user.save();
};

const updateNickname = async (userId, nickname) => {
    return await User.findByIdAndUpdate(userId, { nickname: encryptText(nickname) }, { new: true });
};

const updateVirtualCharacter = async (userId, virtualCharacter) => {
    return await User.findByIdAndUpdate(userId, { virtualCharacter: encryptText(virtualCharacter) }, { new: true });
};

const updateInputMode = async (userId, inputMode) => {
    return await User.findByIdAndUpdate(userId, { inputMode: encryptText(inputMode) }, { new: true });
};

module.exports = {
    setInitialPreferences,
    updateNickname,
    updateVirtualCharacter,
    updateInputMode
};
