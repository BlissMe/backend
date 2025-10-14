const { uploadSketchService, getAllSketchesService } = require("../services/sketchService");

const uploadSketch = async (req, res) => {
    try {
        const { name } = req.body;
        const filePath = req.file.path;

        const sketch = await uploadSketchService(filePath, name);
        res.status(200).json({ message: "Sketch uploaded", sketch });
    } catch (err) {
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};

const getAllSketches = async (req, res) => {
    try {
        const sketches = await getAllSketchesService();
        res.status(200).json(sketches);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch sketches", error: err.message });
    }
};

module.exports = {
    uploadSketch,
    getAllSketches
};
