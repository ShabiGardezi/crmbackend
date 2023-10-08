const router = require("express").Router();
const Ticket = require("../schemas/tickets");

router.post("/", async (req, res) => {
  // create ticket
  const {
    created_by,
    majorAssignee,
    status,
    dueDate,
    businessdetails,
    Services,
    quotation,
    TicketDetails,
  } = req.body;

  if (!created_by || !majorAssignee || !status || !dueDate)
    return res.status(500).json({ payload: "", message: "Payload Missing" });

  const newTicket = new Ticket({
    created_by,
    majorAssignee,
    status,
    businessdetails,
    Services,
    quotation,
    TicketDetails,
  });

  const ticket = await newTicket.save();

  return res.status(200).json({ payload: ticket, message: "ticket created" });
});

router.get("/", async (req, res) => {
  // get tickets by department
  const { departmentId } = req.params;
  const tickets = await Ticket.find({ majorAssignee: departmentId });

  return res.status(200).json({ payload: tickets, message: "tickets fetched" });
});

router.get("/completed-count", async (req, res) => {
  const { departmentId } = req.params;
  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: "COMPLETED",
  }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets completed count" });
});

router.get("/notStarted-count", async (req, res) => {
  const { departmentId } = req.params;

  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: "Not Started Yet",
  }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
});

module.exports = router;
