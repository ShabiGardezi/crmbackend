const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const signupRoute = require("./routes/signup");
const signinRoute = require("./routes/signin");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "crmrankbpo", // Specify the database name here
  })
  .then(() => console.log("DB connection success"))
  .catch((err) => {
    console.log(err);
  });
//connectTodatabase();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: "GET, POST, PUT, DELETE", // Allowed HTTP methods
  })
);

//API
app.use("/api/user", signupRoute);
app.use("/api/user", signinRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
