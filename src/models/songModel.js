const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        audioUrl: { type: String, required: true },   // Cloudinary mp3 URL
        coverUrl: { type: String },                   // optional cover image
    },
    { timestamps: true }
);

module.exports = mongoose.model("Song", SongSchema);
