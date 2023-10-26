const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const signupRoute = require("./routes/signup");
const signinRoute = require("./routes/signin");
const departmentsRoute = require("./routes/departments");
const ticketRoute = require("./routes/ticket");
const notesRoute = require("./routes/notes");
const clientNamesRoute = require("./routes/clientNames"); // Replace with the actual path

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
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
    methods: "GET, POST, PUT, DELETE", // Allowed HTTP methods
  })
);

//API
app.use("/api/user", signupRoute);
app.use("/api/user", signinRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/notes", notesRoute);
app.use("/api/clientName", clientNamesRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
