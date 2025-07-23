const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const characterSchema = new mongoose.Schema({
    characterId: {
        type: Number,
        unique: true,
    },
    name: String,
    imageUrl: String,
});

characterSchema.plugin(AutoIncrement, { inc_field: "characterId" });

module.exports = mongoose.model("Character", characterSchema);
