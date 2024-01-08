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
  clientEmail: {
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
  gmbUrl: {
    type: String,
  },
  work_status: {
    type: String,
  },
  WebsiteURL: {
    type: String,
  },
  ReferralWebsite: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  facebookURL: {
    type: String,
  },
  noOfreviewsGMB: {
    type: String,
  },
  noOfFbreviews: {
    type: String,
  },
  ownerName: {
    type: String,
  },
});
module.exports = mongoose.model("client", ClientSchema);
