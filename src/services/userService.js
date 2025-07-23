const userModel = require("../models/userModel");
const User = require("../models/userModel");
const { encrypt, decrypt } = require("../utils/chatEncryption");

const setInitialPreferences = async (userId, { nickname, virtualCharacter, inputMode }) => {
    const user = await User.findOne({ userID: userId });
    if (!user) throw new Error("User not found");

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
        virtualCharacter: user.virtualCharacter || null,
        inputMode: user.inputMode || null,
    };
};

const updateNickname = async (userId, nickname) => {
    return await User.findOneAndUpdate(
        { userID: userId },
        { nickname: encrypt(nickname) },
        { new: true }
    );
};

const updateVirtualCharacter = async (userId, virtualCharacter) => {
    return await User.findOneAndUpdate(
        { userID: userId },
        { virtualCharacter: virtualCharacter },
        { new: true }
    );
};

const updateInputMode = async (userId, inputMode) => {
    return await User.findOneAndUpdate(
        { userID: userId },
        { inputMode: inputMode },
        { new: true }
    );
};

module.exports = {
    setInitialPreferences,
    updateNickname,
    updateVirtualCharacter,
    updateInputMode,
    getUserPreferences
};
