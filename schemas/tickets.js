const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  majorAssignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },

  assignorDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Not Started Yet",
  },
  // priority: {
  //   type: String,
  //   required: true,
  //   default: "Moderate",
  // },
  businessdetails: {},
  Services: {},
  quotation: {},
  TicketDetails: {},
});
module.exports = mongoose.model("ticket", TicketSchema);
