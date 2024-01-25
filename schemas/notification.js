const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  ticket_Id: {
    type: String,
  },
  user_Id: {
    type: String,
    required: false,
  },
  user_name: {
    type: String,
    required: false,
  },
  business_name: {
    type: String,
    default: "",
    required: false,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dueDate: {
    type: String,
    required: false,
  },
  majorAssignee: {
    type: String,
    required: false,
  },
  majorAssigneeId: {
    type: String,
  },
  assignorDepartmentId: {
    type: String,
  },
  assignorDepartment: {
    type: String,
    required: false,
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
  notes: {
    type: String,
  },
  message: {
    type: String,
    required: false,
  },
  forInBox: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("notification", NotificationSchema);
