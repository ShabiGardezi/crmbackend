const router = require("express").Router();
const Ticket = require("../schemas/tickets");

//API TO CREATE TICKET
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
//API TO GET TICKETS CREATED COUNT

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
//API TO GET TICKETS ASSIGNED COUNT
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
//API TO GET ALL TICKETS
router.get("/all", async (req, res) => {
  // get all tickets

  const tickets = await Ticket.find({});

  return res.status(200).json({ payload: tickets, message: "tickets fetched" });
});
//API TO GET CLOSE TICKETS COUNT

router.get("/completed-count", async (req, res) => {
  const { departmentId } = req.query;
  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: "Completed",
  }).count();

  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets completed count" });
});
//API TO GET OPEN TICKETS COUNT
router.get("/notStarted-count", async (req, res) => {
  const { departmentId } = req.query;

  const ticketsCount = await Ticket.find({
    majorAssignee: departmentId,
    status: { $ne: "Completed" },
  }).count();
  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
});
//API TO SHOW COMPLETED TITCKETS
router.get("/completed", async (req, res) => {
  const { departmentId } = req.query;

  try {
    const completedTickets = await Ticket.find({
      majorAssignee: departmentId,
      status: "Completed",
    })
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");

    return res
      .status(200)
      .json({ payload: completedTickets, message: "Completed tickets" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching completed tickets" });
  }
});

//API TO SHOW NOT-COMPLETED TITCKETS

router.get("/notStarted", async (req, res) => {
  const { departmentId } = req.query;
  try {
    const notStartedTickets = await Ticket.find({
      majorAssignee: departmentId,
      status: { $ne: "Completed" },
    })
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");
    return res
      .status(200)
      .json({ payload: notStartedTickets, message: "Not Started Yet tickets" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching Not Started Yet tickets" });
  }
});
//API TO UPDATE TICKET STATUS
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
//API TO SEARCH CLIENT BY CLIENT-NAME
router.get("/client-search", async (req, res) => {
  try {
    const { searchString } = req.query;

    const respone = await Ticket.find({
      "businessdetails.clientName": { $regex: searchString, $options: "i" },
    })

      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");
    return res
      .status(200)
      .json({ payload: respone, message: "status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
});

//Get individual ticket details
router.get("/:ticketId", async (req, res) => {
  try {
    // Get the ticketId from the route parameters
    const { ticketId } = req.params;

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId)
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");

    // Check if the ticket exists and return it as a response
    if (ticket) {
      return res
        .status(200)
        .json({ payload: ticket, message: "Ticket details fetched" });
    } else {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//API TO UPDATE REPORTING DATE
router.put("/reportingDate-update", async (req, res) => {
  try {
    const { ticketId, reportingDate } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { reportingDate: reportingDate },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ payload: updated, message: "reportingDate updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
});

// API to retrieve reporting date for a ticket
router.get("/reporting-date/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const reportingDate = ticket.reportingDate;

    if (!reportingDate) {
      return res
        .status(404)
        .json({ message: "Reporting date not available for this ticket" });
    }

    return res
      .status(200)
      .json({ payload: reportingDate, message: "Reporting date retrieved" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

<<<<<<< HEAD
router.put("/active-status/update", async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { ActiveNotActive: status },
=======
// Create an API route to update notes for a specific ticket
router.put("/notes-update", async (req, res) => {
  try {
    const { ticketId, notes } = req.body;

    // Use Mongoose to find and update the specific ticket by its ID
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { "businessdetails.notes": notes },
>>>>>>> a8965e2 (web seo client sheets)
      },
      { new: true }
    );

<<<<<<< HEAD
    return res
      .status(200)
      .json({ payload: updated, message: "status updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
=======
    if (!updated) {
      // If the ticket is not found, return an error
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ payload: updated, message: "Notes updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
>>>>>>> a8965e2 (web seo client sheets)
  }
});

module.exports = router;
