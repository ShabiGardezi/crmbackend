const router = require("express").Router();
const Ticket = require("../schemas/tickets");

router.post("/", async (req, res) => {
  // create ticket
  const {
    created_by,
    majorAssignee,
    assignorDepartment,
    dueDate,
    businessdetails,
    Services,
    quotation,
    TicketDetails,
  } = req.body;

  if (!created_by || !majorAssignee || !dueDate || !assignorDepartment)
    return res.status(500).json({ payload: "", message: "Payload Missing" });

  const newTicket = new Ticket({
    created_by,
    majorAssignee,
    dueDate,
    businessdetails,
    Services,
    quotation,
    TicketDetails,
    assignorDepartment,
  });

  const ticket = await newTicket.save();

  return res.status(200).json({ payload: ticket, message: "ticket created" });
});

// Define the route for getting tickets by department
router.get("/", async (req, res) => {
  try {
    // Get the departmentId from the query parameters
    const { departmentId } = req.query;

    // Find tickets with majorAssignee matching the departmentId
    const tickets = await Ticket.find({ majorAssignee: departmentId })
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");
    // Check if there are any tickets, and return them as a response
    if (tickets && tickets.length > 0) {
      return res
        .status(200)
        .json({ payload: tickets, message: "Tickets fetched" });
    } else {
      return res
        .status(404)
        .json({ message: "No tickets found for the specified department" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Define the route for getting tickets assigned by individual department

router.get("/created", async (req, res) => {
  try {
    // Get the departmentId from the query parameters
    const { departmentId } = req.query;

    // Find tickets with assignorDepartment matching the departmentId
    const tickets = await Ticket.find({ assignorDepartment: departmentId })
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");

    // Check if there are any tickets, and return them as a response
    if (tickets && tickets.length > 0) {
      return res
        .status(200)
        .json({ payload: tickets, message: "Tickets fetched" });
    } else {
      return res
        .status(404)
        .json({ message: "No tickets found for the specified department" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/created-count", async (req, res) => {
  const { departmentId } = req.query;

  try {
    // Find tickets with assignorDepartment matching the departmentId
    const createdTickets = await Ticket.find({
      assignorDepartment: departmentId,
    }).count();

    return res.status(200).json({
      payload: createdTickets,
      message: "Count of created tickets",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/assigned-count", async (req, res) => {
  const { departmentId } = req.query;

  try {
    // Find tickets with majorAssignee matching the departmentId
    const assignedTickets = await Ticket.find({
      majorAssignee: departmentId,
    }).count();

    return res.status(200).json({
      payload: assignedTickets,
      message: "Count of assigned tickets",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", async (req, res) => {
  // get all tickets

  const tickets = await Ticket.find({});

  return res.status(200).json({ payload: tickets, message: "tickets fetched" });
});

router.get("/completed-count", async (req, res) => {
  const { departmentId } = req.query;
  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: "COMPLETED",
  }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets completed count" });
});

router.get("/notStarted-count", async (req, res) => {
  const { departmentId } = req.query;

  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: { $ne: "COMPLETED" },
  }).count();
  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
});

router.put("/status-update", async (req, res) => {
  try {
    const { ticketId, status } = req.body;

    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { status: status },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ payload: updated, message: "status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
});

router.get("/client-search", async (req, res) => {
  try {
    const { searchString } = req.query;

    const respone = await Ticket.find({
      "businessdetails.clientName": { $regex: searchString, $options: "i" },
    });

    return res
      .status(200)
      .json({ payload: respone, message: "status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
});

module.exports = router;
