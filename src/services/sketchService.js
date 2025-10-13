const cloudinary = require("../utils/cloudinary");
const Character = require("../models/sketchModel");
const fs = require("fs");

const uploadSketchService = async (filePath, name) => {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "virtual_sketches"
    });

    const sketch = new Sketch({
        name,
        imageUrl: result.secure_url
    });

    await sketch.save();

    // Remove temp file
    fs.unlinkSync(filePath);

    return sketch;
};

const getAllSketchesService = async () => {
    const sketches = await Sketch.find().sort({ sketchId: 1 });
    return sketches;
};

module.exports = {
    uploadSketchService,
    getAllSketchesService
};
