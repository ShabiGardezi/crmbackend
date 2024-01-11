const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Ticket = require("../schemas/tickets");
const Client = require("../schemas/clients");
const Notifications = require("../schemas/notification");
const User = require("../schemas/users");
const departments = require("../schemas/departments");
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
    payment_history,
  } = req.body;

  if (!created_by || !majorAssignee || !dueDate || !assignorDepartment)
    return res.status(500).json({ payload: "", message: "Payload Missing" });
  let created_by_sales_department = false;
  if (assignorDepartment === "651b3409819ff0aec6af1387") {
    created_by_sales_department = true;
  }
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
      facebookURL: businessdetails.facebookURL,
      country: businessdetails.country,
      street: businessdetails.street,
      zipcode: businessdetails.zipcode,
      socialProfile: businessdetails.socialProfile,
      gmbUrl: businessdetails.gmbUrl,
      work_status: businessdetails.work_status,
      WebsiteURL: businessdetails.WebsiteURL,
      ReferralWebsite: businessdetails.ReferralWebsite,
      noOfFbreviews: businessdetails.noOfFbreviews,
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
    created_by_sales_department,
    payment_history: [{ date: new Date(), payment: payment_history }],
  });

  const ticket = await newTicket.save();
  return res
    .status(200)
    .json({ payload: { _id: ticket._id }, message: "ticket created" });
});

router.post("/update_payment_history", async (req, res) => {
  try {
    const { payment, ticketId } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          payment_history: { date: new Date(), payment: parseFloat(payment) },
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ payload: updated, message: "payment history updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/update_payment/:ticketId/:paymentIndex", async (req, res) => {
  try {
    const { ticketId, paymentIndex } = req.params;
    const { payment } = req.body;

    const updatedTicket = await Ticket.findById(ticketId);

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const paymentHistory = updatedTicket.payment_history;

    if (paymentIndex < 0 || paymentIndex >= paymentHistory.length) {
      return res.status(400).json({ message: "Invalid payment index" });
    }

    paymentHistory[paymentIndex].payment = parseFloat(payment);
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      { payment_history: paymentHistory },
      { new: true }
    );

    return res
      .status(200)
      .json({ payload: updated, message: "Payment updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// API endpoint to get users by department
router.get("/users/:departmentId", async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const users = await User.find({ department: departmentId });

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      username: user.username,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Define the route for getting all departments tickets
router.get("/all-departments-ticket", async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignorDepartment: new mongoose.Types.ObjectId(
        "651b3409819ff0aec6af1387"
      ),
    })
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

// Define the route for getting tickets by department
router.get("/", async (req, res) => {
  try {
    // Get the departmentId from the query parameters
    const { departmentId, salesDep } = req.query;
    // Find tickets with majorAssignee matching the departmentId
    let flag = false;
    if (salesDep === "true") flag = true;

    const tickets = await Ticket.find({
      majorAssignee: new mongoose.Types.ObjectId(departmentId),
      created_by_sales_department: flag,
    })
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

// Define the route for getting tickets by department assignor and assignee for home notification
router.get("/reportingdate-notification", async (req, res) => {
  try {
    const { userDepartmentId, salesDep } = req.query;
    let flag = false;
    if (salesDep === "true") flag = true;

    const tickets = await Ticket.find({
      $or: [
        { majorAssignee: new mongoose.Types.ObjectId(userDepartmentId) },
        { assignorDepartment: new mongoose.Types.ObjectId(userDepartmentId) },
      ],
      created_by_sales_department: flag,
    })
      .populate("majorAssignee", "name")
      .populate("assignorDepartment", "name");

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

// Define a new route to get tickets with work_status "Monthly SEO"
router.get("/tickets-except-monthly-seo/:majorAssignee", async (req, res) => {
  try {
    // const { salesDep } = req.query;
    // let flag = false;
    // if (salesDep === "true") flag = true;

    // Query the database to find tickets with work_status other than "Monthly-SEO" and assigned to the specified majorAssignee
    const ticketsExceptMonthlySeo = await Ticket.find({
      "businessdetails.work_status": { $ne: "Monthly-SEO" },
      majorAssignee: "65195c8f504d80e8f11b0d15",
      created_by_sales_department: true,
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

router.get(
  "/tickets-count-except-monthly-seo/:majorAssignee",
  async (req, res) => {
    try {
      const { salesDep } = req.query;
      let flag = false;
      if (salesDep === "true") flag = true;
      // Query the database to find the count of tickets with work_status other than "Monthly-SEO" and assigned to the specified majorAssignee
      const countOfTicketsExceptMonthlySeo = await Ticket.countDocuments({
        "businessdetails.work_status": { $ne: "Monthly-SEO" },
        majorAssignee: "65195c8f504d80e8f11b0d15",
        created_by_sales_department: true,
      });

      // Return the count as a response
      return res.status(200).json({
        count: countOfTicketsExceptMonthlySeo,
        message:
          "Count of tickets except Monthly SEO assigned to majorAssignee fetched",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// Define a route to count tickets with work_status 'Monthly-SEO'
router.get("/tickets-count-monthly-seo", async (req, res) => {
  try {
    // Query the database to find the count of tickets with work_status "Monthly-SEO"
    const countOfMonthlySeoTickets = await Ticket.countDocuments({
      "businessdetails.work_status": "Monthly-SEO",
      created_by_sales_department: true,
    });

    // Return the count as a response
    return res.status(200).json({
      count: countOfMonthlySeoTickets,
      message: "Count of Monthly-SEO tickets fetched",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Define a route to get tickets with work_status Monthly-SEO
router.get("/monthly-seo-tickets", async (req, res) => {
  try {
    // Query the database to find tickets with work_status "Monthly-SEO"
    const monthlySeoTickets = await Ticket.find({
      "businessdetails.work_status": "Monthly-SEO",
      created_by_sales_department: true,
    });

    // Check if there are any matching tickets and return them as a response
    if (monthlySeoTickets && monthlySeoTickets.length > 0) {
      return res.status(200).json({
        payload: monthlySeoTickets,
        message: "Tickets with work_status Monthly-SEO fetched",
      });
    } else {
      return res.status(404).json({
        message: "No tickets with work_status Monthly-SEO found",
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
      status: { $ne: "Completed" },
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
//API TO GET SALES OPEN TICKETS
router.get("/openTickets", async (req, res) => {
  const { departmentId } = req.query;
  try {
    const notStartedTickets = await Ticket.find({
      assignorDepartment: departmentId,
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
//API TO GET SALES OPEN TICKETS COUNT

router.get("/openTickets-count", async (req, res) => {
  const { departmentId } = req.query;

  const ticketsCount = await Ticket.find({
    assignorDepartment: departmentId,
    status: { $ne: "Completed" },
  }).count();
  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
});
//API TO SHOW COMPLETED TITCKETS SALES
router.get("/completedTickets", async (req, res) => {
  const { departmentId } = req.query;

  try {
    const completedTickets = await Ticket.find({
      assignorDepartment: departmentId,
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
//API TO GET SALES CLOSE TICKETS COUNT

router.get("/completedTickets-count", async (req, res) => {
  const { departmentId } = req.query;

  const ticketsCount = await Ticket.find({
    assignorDepartment: departmentId,
    status: "Completed",
  }).count();
  return res
    .status(200)
    .json({ payload: ticketsCount, message: "tickets notSarted Yet count" });
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
    const { ticketId, notes, departmentId, departmentName } = req.body;

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
    // Retrieve the user associated with the department
    const user = await User.findOne({ department: departmentId });
    const ticket = await Ticket.findById(ticketId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for the department" });
    }

    const username = user.username;
    if (departmentId === updated.majorAssignee.toString()) {
      const newNotification = new Notifications({
        ticket_Id: ticketId,
        majorAssigneeId: updated.assignorDepartment,
        assignorDepartment: departmentName,
        assignorDepartmentId: departmentId,
        forInBox: false,
        message: `${username} has edited the notes for Business Name: ${ticket.businessdetails.clientName}`,
      });
      await newNotification.save();
    } else if (departmentId === updated.assignorDepartment.toString()) {
      const newNotification = new Notifications({
        ticket_Id: ticketId,
        majorAssigneeId: updated.majorAssignee,
        assignorDepartment: departmentName,
        assignorDepartmentId: updated.assignorDepartment,
        forInBox: false,
        message: `${username} has edited the notes for Business Name: ${ticket.businessdetails.clientName}`,
      });
      await newNotification.save();
    }

    if (departmentId === updated.majorAssignee.toString()) {
      const newNotification = new Notifications({
        ticket_Id: ticketId,
        majorAssigneeId: updated.assignorDepartment,
        assignorDepartment: departmentName,
        assignorDepartmentId: departmentId,
        forInBox: false,
        message: "assignee department has editied the notes",
      });
      await newNotification.save();
    } else if (departmentId === updated.assignorDepartment.toString()) {
      const newNotification = new Notifications({
        ticket_Id: ticketId,
        majorAssigneeId: updated.majorAssignee,
        assignorDepartment: departmentName,
        assignorDepartmentId: updated.assignorDepartment,
        forInBox: false,
        message: "assignor department has editied the notes",
      });
      await newNotification.save();
    }

    return res.status(200).json({ payload: updated, message: "Notes updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// API to retrieve notes for a ticket
router.get("/notes/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const notes = ticket.businessdetails.notes;

    if (!notes) {
      return res
        .status(404)
        .json({ message: "Notes not available for this ticket" });
    }

    return res
      .status(200)
      .json({ payload: notes, message: "Notes retrieved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Create an API route to update remaining price for a specific ticket
router.put("/remaining-update", async (req, res) => {
  try {
    const { ticketId, remaining } = req.body;

    // Use Mongoose to find and update the specific ticket by its ID
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { "quotation.remainingPrice": remaining },
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
router.get("/remaining/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Use Mongoose to find the specific ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      // If the ticket is not found, return an error
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Return the remaining price from the ticket object
    const remainingPrice = ticket.quotation.remainingPrice;
    return res.status(200).json({ remainingPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create an API route to update keywords for a specific ticket
router.put("/keywords-update", async (req, res) => {
  try {
    const { ticketId, Keywords } = req.body;

    // Use Mongoose to find and update the specific ticket by its ID
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { "businessdetails.Keywords": Keywords },
      },
      { new: true }
    );

    if (!updated) {
      // If the ticket is not found, return an error
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res
      .status(200)
      .json({ payload: updated, message: "Keywords updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Create an API route to update notes for a specific ticket
router.put("/likesfollowers-update", async (req, res) => {
  try {
    const { ticketId, LikesFollowers } = req.body;

    // Use Mongoose to find and update the specific ticket by its ID
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: { "businessdetails.LikesFollowers": LikesFollowers },
      },
      { new: true }
    );

    if (!updated) {
      // If the ticket is not found, return an error
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res
      .status(200)
      .json({ payload: updated, message: "LikesFollowers updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
