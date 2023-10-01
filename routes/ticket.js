const router = require("express").Router();
const Ticket = require("../schemas/tickets");

router.post("/", async (req, res) => {
  // create ticket
  const { data, created_by, majorAssignee, status } = req.body;

  if (!created_by || !majorAssignee || !data || !status)
    return res.status(500).json({ payload: "", message: "Payload Missing" });

  const newTicket = new Ticket({
    data,
    created_by,
    majorAssignee,
    status,
  });

  const ticket = await newTicket.save();

  return res.status(200).json({ payload: ticket, message: "ticket created" });
});

router.get("/", async (req, res) => {
  // get tickets

  const tickets = await Ticket.find({});

  return res.status(200).json({ payload: tickets, message: "tickets fetched" });
});

router.get("/completed-count", async (req, res) => {
  const ticketsCount = await Ticket.find({ status: "COMPLETED" }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets completed count" });
});

router.get("/notStarted-count", async (req, res) => {
  const ticketsCount = await Ticket.find({ status: "Not Started Yet" }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
});

module.exports = router;
