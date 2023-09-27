const router = require("express").Router();
const User = require("../schemas/users");

// Add the express-session middleware to enable session management
router.use(
  require("express-session")({
    secret: "rankbpo123", // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne(
    { email: email, password: password },
    "-password"
  );

  if (!findUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // req.session.user = findUser;
  res.json({ message: "Login successful", payload: findUser });
});

router.post("/logout", (req, res) => {
  // Clear the user's session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});
module.exports = router;
