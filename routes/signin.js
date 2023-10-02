const router = require("express").Router();
const User = require("../schemas/users");
const session = require("express-session");

router.use(
  session({
    secret: "your-secret-key", // Replace with a secret key for session management
    resave: false,
    saveUninitialized: true,
  })
);
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne(
    { email: email, password: password },
    "-password"
  ).populate("department", "name");

  if (!findUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // req.session.user = findUser;
  res.json({ message: "Login successful", payload: findUser });
});

router.post("/logout", (req, res) => {
  // Clear the user's session
  const session = req.session; // Initialize the session
  session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

router.get("/userdata", (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  // Get the user's data from the database
  const user = req.session.user;

  // Return the user's data
  res.json(user);
});

module.exports = router;
