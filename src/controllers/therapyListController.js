const {
    getAllTherapies,
    getTherapiesByLevel,
    addTherapy,
} = require("../services/therapyListService");

const handleGetAllTherapies = async (req, res) => {
    try {
        const therapies = await getAllTherapies();
        res.status(200).json({ success: true, therapies });
    } catch (err) {
        console.error("Failed to fetch therapies:", err);
        res.status(500).json({ success: false, error: "Failed to fetch therapies" });
    }
};

const handleGetTherapiesByLevel = async (req, res) => {
    const { level } = req.params;

    try {
        const therapies = await getTherapiesByLevel(level);
        res.status(200).json({ success: true, therapies });
    } catch (err) {
        console.error("Failed to fetch therapies by level:", err);
        res.status(500).json({ success: false, error: "Failed to fetch therapies by level" });
    }
};

const handleAddTherapy = async (req, res) => {
    const { therapyID, name, applicableLevel, description, path, durationMinutes } = req.body;

    try {
        const newTherapy = await addTherapy({
            therapyID,
            name,
            applicableLevel,
            description,
            path,
            durationMinutes,
        });

        res.status(201).json({ success: true, therapy: newTherapy });
    } catch (err) {
        console.error("Failed to add therapy:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    handleGetAllTherapies,
    handleGetTherapiesByLevel,
    handleAddTherapy,
};
