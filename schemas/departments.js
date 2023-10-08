const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Sales: {},
});
module.exports = mongoose.model("department", DepartmentSchema);

// "Local SEO / GMB Optimization": {},
// "Wordpress Development": {},
// "Website SEO": {},
// "Custom Development": {},
// "Paid Marketing": {},
// "Social Media Management": {},
// "Customer Reviews Management": {},
