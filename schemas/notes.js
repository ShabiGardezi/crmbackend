const mongoose = require("mongoose");

// Function to format date as yy-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
    type: String, // Save the date as a string
    default: formatDate(new Date()), // Set the default value to the current formatted date
  },
});

// Pre-save hook to format the date before saving
NotesSchema.pre("save", function (next) {
  this.date = formatDate(new Date());
  next();
});

module.exports = mongoose.model("note", NotesSchema);
