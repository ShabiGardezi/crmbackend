const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect("mongodb+srv://RankBPOCRM:rankorbit123@crm.cxsh9va.mongodb.net/")
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log("Error connecting to database", error);
    });
};
