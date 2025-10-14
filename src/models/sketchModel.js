const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const sketchSchema = new mongoose.Schema({
    sketchId: {
        type: Number,
        unique: true,
    },
    name: String,
    imageUrl: String,
});

sketchSchema.plugin(AutoIncrement, { inc_field: "sketchId" });

module.exports = mongoose.model("Sketch", sketchSchema);
