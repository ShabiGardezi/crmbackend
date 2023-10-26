const express = require("express");
const router = express.Router();
const Ticket = require("../schemas/tickets"); // Replace with your actual Ticket model

router.get("/client-names", async (req, res) => {
  try {
    // Fetch distinct client names from your Ticket collection
    const clientNames = await Ticket.distinct("businessdetails.clientName");

    res.json({ clientNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching client names" });
  }
});

module.exports = router;
