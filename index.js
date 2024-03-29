const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const signupRoute = require("./routes/signup");
const signinRoute = require("./routes/signin");
const departmentsRoute = require("./routes/departments");
const ticketRoute = require("./routes/ticket");
const notesRoute = require("./routes/notes");
const notificationRoute = require("./routes/notification");
const clientRoute = require("./routes/clientNames");
dotenv.config();
mongoose
  .connect(
    "mongodb+srv://crmrankbpo:8PQnqzqTnGeXnSAX@crmrankorbit.gq2hhuc.mongodb.net",
    {
      dbName: "CRM", // Specify the database name here
    }
  )
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
    methods: "GET, POST, PUT, PATCH, DELETE", // Allowed HTTP methods
  })
);

//API
app.use("/api/user", signupRoute);
app.use("/api/user", signinRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/notes", notesRoute);
app.use("/api/client", clientRoute);
app.use("/api/notification", notificationRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
