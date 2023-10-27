const express = require("express");
const router = express.Router();
const Client = require("../schemas/clients"); // Replace with your actual Ticket model

// router.get("/client-names", async (req, res) => {
//   try {
//     const search = req.query.search || ""; // Get the search query from the request
//     // Fetch client names from your Ticket collection that match the search query
//     const clientNames = await Ticket.distinct("businessdetails.clientName", {
//       "businessdetails.clientName": { $regex: search, $options: "i" },
//     });

//     res.json({ clientNames });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching client name suggestions" });
//   }
// });
// Endpoint for client name suggestions
router.get("/suggestions", async (req, res) => {
  const { query } = req.query; // Get the user's input
  try {
    // Use a regular expression to find client names starting with the query
    const suggestions = await Client.find({
      clientName: { $regex: `^${query}`, $options: "i" }, // 'i' for case-insensitive matching
    }).select("clientName");

    res.json(suggestions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching suggestions." });
  }
});

router.get("/details/:clientName", async (req, res) => {
  const { clientName } = req.params;

  try {
    const client = await Client.findOne({ clientName });

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.json(client);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching client details." });
  }
});

module.exports = router;
