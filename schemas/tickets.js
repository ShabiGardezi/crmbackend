const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  data: {},
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  majorAssignee: {
    type: mongoose.Types.ObjectId,
    ref: "department",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Not Started Yet",
  },
});
module.exports = mongoose.model("ticket", TicketSchema);
