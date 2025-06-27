const { uploadCharacterService } = require("../services/characterService");

const uploadCharacter = async (req, res) => {
    try {
        const { name } = req.body;
        const filePath = req.file.path;

        const character = await uploadCharacterService(filePath, name);
        res.status(200).json({ message: "Character uploaded", character });
    } catch (err) {
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};

module.exports = {
    uploadCharacter
};
