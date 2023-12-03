const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const signupRoute = require("./routes/signup");
const signinRoute = require("./routes/signin");
const departmentsRoute = require("./routes/departments");
const ticketRoute = require("./routes/ticket");
const notesRoute = require("./routes/notes");
const clientRoute = require("./routes/clientNames"); // Replace with the actual path

dotenv.config();
mongoose
  .connect("mongodb+srv://rankbpo:rankbpo123@crmrankbpo.ae4ccof.mongodb.net/", {
    dbName: "CRM", // Specify the database name here
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
    methods: "GET, POST, PUT, DELETE,PATCH", // Allowed HTTP methods
  })
);

//API
app.use("/api/user", signupRoute);
app.use("/api/user", signinRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/notes", notesRoute);
app.use("/api/client", clientRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
