const User = require("../models/userModel");

const setInitialPreferences = async (userId, { nickname, virtualCharacter, inputMode }) => {
    const user = await User.findOne({ userID: userId });
    if (!user) throw new Error("User not found");

    if ((user.nickname ?? "").trim() !== "") {
        throw new Error("Preferences already set");
    }

    const finalNickname = nickname && nickname.trim() !== "" ? nickname : "pinky";
    user.nickname = finalNickname;
    user.virtualCharacter = virtualCharacter;
    user.inputMode = inputMode;

    return await user.save();
};

const getUserPreferences = async (userId) => {
    const user = await User.findOne({ userID: userId });

    if (!user) throw new Error("User not found");

    return {
        nickname: user.nickname || null, 
        virtualCharacter: user.virtualCharacter || null,
        inputMode: user.inputMode || null,
    };
};

const updateNickname = async (userId, nickname) => {
    const finalNickname = nickname && nickname.trim() !== "" ? nickname : "pinky";
    return await User.findOneAndUpdate(
        { userID: userId },
        { nickname: finalNickname },
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

const updateUserPreferences = async (userId, preferences) => {
    const updates = {};

    if (preferences.nickname !== undefined) {
        updates.nickname = preferences.nickname; 
    }

    if (preferences.virtualCharacter !== undefined) {
        updates.virtualCharacter = preferences.virtualCharacter;
    }

    if (preferences.inputMode !== undefined) {
        updates.inputMode = preferences.inputMode;
    }

    if (Object.keys(updates).length === 0) {
        throw new Error("No valid preferences provided for update");
    }

    const updatedUser = await User.findOneAndUpdate(
        { userID: userId },
        updates,
        { new: true }
    );

    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
};

const getAllUserPreferences = async () => {
    const users = await User.find({});
    if (!users) throw new Error("Users not found");

    // Removed decrypt
    const plainUsers = users.map(user => ({
        ...user.toObject(),
        nickname: user.nickname || null
    }));
    return { users: plainUsers };
};

const updateDepressionLevel = async (userId, level) => {
    return await User.findOneAndUpdate(
        { userID: userId },
        { depressionLevel: level },
        { new: true }
    );
};

const updateMedicineStatus = async (userId, status) => {
    return await User.findOneAndUpdate(
        { userID: userId },
        { takesMedicine: status },
        { new: true }
    );
};

module.exports = {
    setInitialPreferences,
    updateNickname,
    updateVirtualCharacter,
    updateInputMode,
    getUserPreferences,
    updateUserPreferences,
    getAllUserPreferences,
    updateDepressionLevel,
    updateMedicineStatus
};
