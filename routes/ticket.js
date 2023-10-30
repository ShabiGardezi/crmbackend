const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Ticket = require("../schemas/tickets");
const Client = require("../schemas/clients");

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

  const client = await Client.findOne({
    clientName: businessdetails.clientName,
  });
  if (!client) {
    // create a new client
    const newClient = new Client({
      businessHours: businessdetails.businessHours,
      businessNumber: businessdetails.businessNumber,
      clientName: businessdetails.clientName,
      clientEmail: businessdetails.clientEmail,
      state: businessdetails.state,
      city: "",
      country: businessdetails.country,
      street: businessdetails.street,
      zipcode: businessdetails.zipcode,
      socialProfile: businessdetails.socialProfile,
      gmbUrl: businessdetails.gmbUrl,
      workStatus: businessdetails.workStatus,
      WebsiteURL: businessdetails.WebsiteURL,
    });
    await newClient.save();
  }

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
// Define a new route to get tickets with workStatus "Monthly SEO"
// router.get("/tickets-except-monthly-seo", async (req, res) => {
//   try {
//     // Query the database to find tickets with workStatus other than "Monthly-SEO"
//     const ticketsExceptMonthlySeo = await Ticket.find({
//       "businessdetails.workStatus": { $ne: "Monthly-SEO" },
//     });

//     // Check if there are any matching tickets and return them as a response
//     if (ticketsExceptMonthlySeo && ticketsExceptMonthlySeo.length > 0) {
//       return res.status(200).json({
//         payload: ticketsExceptMonthlySeo,
//         message: "Tickets except Monthly SEO fetched",
//       });
//     } else {
//       return res.status(404).json({
//         message: "No tickets except Monthly SEO found",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// });
router.get("/tickets-except-monthly-seo/:majorAssignee", async (req, res) => {
  try {
    const majorAssignee = req.params.majorAssignee;

    // Query the database to find tickets with workStatus other than "Monthly-SEO" and assigned to the specified majorAssignee
    const ticketsExceptMonthlySeo = await Ticket.find({
      "businessdetails.workStatus": { $ne: "Monthly-SEO" },
      majorAssignee: "65195c8f504d80e8f11b0d15" ,
    });

    // Check if there are any matching tickets and return them as a response
    if (ticketsExceptMonthlySeo && ticketsExceptMonthlySeo.length > 0) {
      return res.status(200).json({
        payload: ticketsExceptMonthlySeo,
        message: "Tickets except Monthly SEO assigned to majorAssignee fetched",
      });
    } else {
      return res.status(404).json({
        message:
          "No tickets except Monthly SEO assigned to majorAssignee found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
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

router.get("/active-nonactive-clients", async (req, res) => {
  try {
    const { departmentId, status } = req.query;
    const response = await Ticket.find({
      ActiveNotActive: status,
      majorAssignee: departmentId,
    });

    return res
      .status(200)
      .json({ payload: response, message: "fetched tickets" });
  } catch (error) {
    console.log(error);
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
      .populate("assignorDepartment", "name")
      .populate("majorAssignee", "name");

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

router.put("/active-status/update", async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { ActiveNotActive: status },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ payload: updated, message: "status updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
});

router.get("/active-nonactive-clients", async (req, res) => {
  try {
    const { departmentId, status } = req.query;
    const response = await Ticket.find({
      ActiveNotActive: status,
      majorAssignee: departmentId,
    });

    return res
      .status(200)
      .json({ payload: response, message: "fetched tickets" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
});
// Create an API route to update notes for a specific ticket
router.put("/notes-update", async (req, res) => {
  try {
    const { ticketId, notes } = req.body;

    // Use Mongoose to find and update the specific ticket by its ID
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { "businessdetails.notes": notes },
      },
      { new: true }
    );

    if (!updated) {
      // If the ticket is not found, return an error
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ payload: updated, message: "Notes updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
