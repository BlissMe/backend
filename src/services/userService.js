const userModel = require("../models/userModel");
const User = require("../models/userModel");
const { encrypt, decrypt } = require("../utils/chatEncryption");

const setInitialPreferences = async (userId, { nickname, virtualCharacter, inputMode }) => {
    const user = await User.findOne({ userID: userId });
    if (!user) throw new Error("User not found");

    console.log("Setting initial preferences for user:", userId);
    console.log("Setting initial preferences for user:", user);
    console.log("Setting initial preferences for user:", user.userId);
    console.log("Raw nickname from DB:", user.nickname);

    if ((user.nickname ?? "").trim() !== "") {
        throw new Error("Preferences already set");
    }

    user.nickname = encrypt(nickname);
    user.virtualCharacter = virtualCharacter;
    user.inputMode = inputMode;

    return await user.save();
};

const getUserPreferences = async (userId) => {
    const user = await User.findOne({ userID: userId });

    if (!user) throw new Error("User not found");

    return {
        nickname: user.nickname ? decrypt(user.nickname) : null,
        virtualCharacter: user.virtualCharacter ? decrypt(user.virtualCharacter) : null,
        inputMode: user.inputMode ? decrypt(user.inputMode) : null,
    };
};

const updateNickname = async (userId, nickname) => {
    return await User.findByIdAndUpdate(userId, { nickname: encrypt(nickname) }, { new: true });
};

const updateVirtualCharacter = async (userId, virtualCharacter) => {
    return await User.findByIdAndUpdate(userId, { virtualCharacter: encrypt(virtualCharacter) }, { new: true });
};

const updateInputMode = async (userId, inputMode) => {
    return await User.findByIdAndUpdate(userId, { inputMode: encrypt(inputMode) }, { new: true });
};

module.exports = {
    setInitialPreferences,
    updateNickname,
    updateVirtualCharacter,
    updateInputMode,
    getUserPreferences
};
