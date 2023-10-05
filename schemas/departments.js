const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  "Local SEO / GMB Optimization": {},
  "Wordpress Development": {},
  "Website SEO": {},
  "Custom Development": {},
  "Paid Marketing": {},
  "Social Media Management": {},
  "Customer Reviews Management": {},
  Sales: {},
});
module.exports = mongoose.model("department", DepartmentSchema);
