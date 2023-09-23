const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

connectTodatabase();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: "GET, POST, PUT, DELETE", // Allowed HTTP methods
  })
);
