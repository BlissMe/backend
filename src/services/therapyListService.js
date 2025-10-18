const Therapy = require("../models/therapyList");

async function getAllTherapies() {
    try {
        const therapies = await Therapy.find();
        return therapies;
    } catch (error) {
        console.error("Error fetching all therapies:", error);
        throw new Error("Failed to fetch therapies");
    }
}

async function getTherapiesByLevel(level) {
    try {
        const therapies = await Therapy.find({
            applicableLevel: level.toLowerCase(),
        });
        return therapies;
    } catch (error) {
        console.error("Error fetching therapies by level:", error);
        throw new Error("Failed to fetch therapies by level");
    }
}


async function addTherapy({ therapyID, name, applicableLevel, description, path, durationMinutes }) {
    try {
        const exists = await Therapy.findOne({ therapyID });
        if (exists) {
            throw new Error("Therapy ID already exists");
        }

        const newTherapy = new Therapy({
            therapyID,
            name,
            applicableLevel,
            description,
            path,
            durationMinutes,
        });

        await newTherapy.save();
        return newTherapy;
    } catch (error) {
        console.error("Error adding new therapy:", error);
        throw new Error("Failed to add therapy");
    }
}

module.exports = {
    getAllTherapies,
    getTherapiesByLevel,
    addTherapy,
};
