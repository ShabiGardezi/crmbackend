const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log("Error connecting to database", error);
    });
};
