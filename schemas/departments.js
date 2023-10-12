const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Sales: {},
});
module.exports = mongoose.model("department", DepartmentSchema);
