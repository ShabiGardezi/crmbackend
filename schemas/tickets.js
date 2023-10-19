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
  createdAt: {
    type: Date, // Use the Date data type for createdAt
    default: Date.now, // Set the default value to the current date and time
  },
  reportingDate: {
    type: Date,
    // Set the default value to one month later than createdAt
    default: function () {
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      return oneMonthLater;
    },
  },

  businessdetails: {},
  Services: {},
  quotation: {},
  TicketDetails: {},
});
module.exports = mongoose.model("ticket", TicketSchema);
