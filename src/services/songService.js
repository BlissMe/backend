const Song = require("../models/songModel");
const cloudinary = require("cloudinary").v2;

// configure once (can also do in app.js)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(filePath, folder = "relaxation_songs") {
    // resource_type:auto handles audio/mp3
    return cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder,
    });
}

exports.addSong = async ({ title, artist, audioFile, coverFile }) => {
    // 1. upload audio
    const audioRes = await uploadToCloudinary(audioFile.path);

    // 2. upload cover image if provided
    let coverUrl = null;
    if (coverFile) {
        const coverRes = await uploadToCloudinary(coverFile.path);
        coverUrl = coverRes.secure_url;
    }

    // 3. save to DB
    const song = new Song({
        title,
        artist,
        audioUrl: audioRes.secure_url,
        coverUrl,
    });
    return song.save();
};

exports.getAllSongs = async () => {
    return Song.find().sort({ createdAt: -1 });
};
