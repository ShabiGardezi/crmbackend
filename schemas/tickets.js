const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  data: {},
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  majorAssignee: {
    type: mongoose.Types.ObjectId,
    ref: "department",
    required: true,
  },
  assignor: {
    type: mongoose.Types.ObjectId, //this requires the name of user who assigned the ticket
    ref: "department",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Not Started Yet",
  },
  priority: {
    type: String,
    required: true,
    default: "Moderate",
  },
});
module.exports = mongoose.model("ticket", TicketSchema);
