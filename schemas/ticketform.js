const mongoose = require("mongoose");

const TicketFormSchema = new mongoose.Schema({
  businessdetails: {},
  Services: {},
  quotation: {},
  TicketDetails: {},
});
module.exports = mongoose.model("ticketform", TicketFormSchema);
