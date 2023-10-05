const express = require("express");
const app = express();

// Define the departments object
const departments = {
  "Local SEO / GMB Optimization": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Wordpress Development": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Website SEO": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Custom Development": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Paid Marketing": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Social Media Management": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  "Customer Reviews Management": {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
  Sales: {
    quotation: {
      price: "",
      advanceprice: "",
    },
    ticketdetails: {
      priorityLevel: "",
      assignor: "",
      dueDate: "",
    },
    businessDetails: {
      services: {
        keywords: "",
        webUrl: "",
        loginCredentials: "",
      },
    },
  },
};

// Convert the object to JSON using JSON.stringify
const departmentsJSON = JSON.stringify(departments, null, 2);

// Print the JSON or store it in MongoDB
console.log(departmentsJSON);

// Define a route to return all departments
app.get("/departments", (req, res) => {
  res.json(departments);
});

// Start the Express.js server
const port = 6000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
