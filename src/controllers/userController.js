const userService = require("../services/userService");

const setPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nickname, virtualCharacter, inputMode } = req.body;

    const user = await userService.setInitialPreferences(userId, {
      nickname,
      virtualCharacter,
      inputMode,
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

    const user = await userService.updateVirtualCharacter(
      userId,
      virtualCharacter
    );
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

const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nickname, virtualCharacter, inputMode } = req.body;

    if (inputMode && !["voice", "text"].includes(inputMode.toLowerCase())) {
      return res.status(400).json({ message: "Invalid input mode" });
    }

    const updatedUser = await userService.updateUserPreferences(userId, {
      nickname,
      virtualCharacter,
      inputMode,
    });

    res.status(200).json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllPreferences = async (req, res) => {
  try {

    const preferences = await userService.getAllUserPreferences();
    res.status(200).json({
      message: "All User preferences fetched successfully",
      preferences,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const setDepressionLevel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { depressionLevel } = req.body;

    if (!depressionLevel) {
      await userService.updateDepressionLevel(userId, "unknown");
      return res.status(200).json({ message: "Depression level saved" });
    }

    if (!["noidea","mild", "moderate", "severe"].includes(depressionLevel.toLowerCase())) {
      return res.status(400).json({ message: "Invalid depression level" });
    }

    const user = await userService.updateDepressionLevel(
      userId,
      depressionLevel.toLowerCase()
    );
    res.status(200).json({ message: "Depression level saved", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const setMedicineStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { takesMedicine } = req.body;

    if (!takesMedicine) {
      await userService.updateMedicineStatus(userId, "skipped");
      return res.status(200).json({ message: "Medicine status saved" });
    }

    if (!["yes", "no"].includes(takesMedicine.toLowerCase())) {
      return res.status(400).json({ message: "Invalid input for medicine" });
    }

    const user = await userService.updateMedicineStatus(
      userId,
      takesMedicine.toLowerCase()
    );
    res.status(200).json({ message: "Medicine status saved", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  setPreferences,
  updateNickname,
  updateVirtualCharacter,
  updateInputMode,
  getPreferences,
  updatePreferences,
  getAllPreferences,
  setDepressionLevel,
  setMedicineStatus,
};
