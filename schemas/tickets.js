const mongoose = require("mongoose");
const Client = require("../schemas/clients");

const PaymentHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: Number,
    required: true,
  },
  fronter: {
    type: String,
    required: true,
  },
  closer: {
    type: String,
    required: true,
  },
});

const RemainingPriceSnapshotSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  remainingPrice: {
    type: Number,
    required: true,
  },
  fronter: {
    type: String,
    required: true,
  },
  closer: {
    type: String,
    required: true,
  },
});
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
  ActiveNotActive: {
    type: String, // Use the Date data type for createdAt
    default: "Active", // Set the default value to the current date and time
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
  created_by_sales_department: {
    type: Boolean,
    required: true,
    default: false,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  businessdetails: {},
  Services: {},
  quotation: {},
  TicketDetails: {},
  payment_history: [PaymentHistorySchema],
  remaining_price_history: [RemainingPriceSnapshotSchema], // New field to track remaining price history
  clientReporting: [],
});
module.exports = mongoose.model("ticket", TicketSchema);
