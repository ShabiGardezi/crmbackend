const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    note: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    date: {
        type: String,
        default: "",
    },
    seen: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model("note", NotesSchema);
