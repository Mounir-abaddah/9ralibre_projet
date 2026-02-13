const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "itemModel"
    },
    itemModel: {
        type: String,
        required: true,
        enum: ["Cours", "Video"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Saved", SavedSchema);
