const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  businessHours: {
    type: String,
  },
  businessNumber: {
    type: String,
  },
  clientName: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  street: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  socialProfile: {
    type: String,
  },
});
module.exports = mongoose.model("client", ClientSchema);
