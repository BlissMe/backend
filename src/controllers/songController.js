const songService = require("../services/songService");

exports.createSong = async (req, res) => {
    try {
        const { title, artist } = req.body;
        if (!title || !artist || !req.files?.audio) {
            return res.status(400).json({ message: "Title, artist, and audio required" });
        }

        const song = await songService.addSong({
            title,
            artist,
            audioFile: req.files.audio[0],
            coverFile: req.files.cover ? req.files.cover[0] : null,
        });

        res.status(201).json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add song" });
    }
};

exports.listSongs = async (_req, res) => {
    try {
        const songs = await songService.getAllSongs();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching songs" });
    }
};
