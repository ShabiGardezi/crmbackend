const express = require("express");
const router = express.Router();
const Client = require("../schemas/clients");

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
