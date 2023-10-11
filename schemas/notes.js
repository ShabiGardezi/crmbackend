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
});
module.exports = mongoose.model("note", NotesSchema);