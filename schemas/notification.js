const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  ticket_Id: {
    type: String,
  },
  user_Id: {
    type: String,
  },
  user_name: {
    type: String,
  },
  client_name: {
    type: String,
    default: "",
  },
  dueDate: {
    type: String,
    required: true,
  },
  majorAssignee: {
    type: String,
  },
  majorAssigneeId: {
    type: String,
  },
  assignorDepartmentId: {
    type: String,
  },
  assignorDepartment: {
    type: String,
  },
  createdAt: {
    type: Date, // Use the Date data type for createdAt
    default: () => new Date(),
  },
  isRead: {
    type: Boolean,
    default: () => false,
  },
  reportingDate: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("notification", NotificationSchema);
