const cloudinary = require("../utils/cloudinary");
const Character = require("../models/characterModel");
const fs = require("fs");

const uploadCharacterService = async (filePath, name) => {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "virtual_characters"
    });

    const character = new Character({
        name,
        imageUrl: result.secure_url
    });

    await character.save();

    // Remove temp file
    fs.unlinkSync(filePath);

    return character;
};

const getAllCharactersService = async () => {
    const characters = await Character.find().sort({ characterId: 1 });
    return characters;
};

module.exports = {
    uploadCharacterService,
    getAllCharactersService
};
