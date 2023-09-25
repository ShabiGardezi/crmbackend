const router = require("express").Router();
const User = require("../schemas/users");

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
  
    const findUser = await User.findOne(
      { email: email, password: password },
      "-password"
    );
  
    if (!findUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    res.json({ message: "Login successful", payload: findUser });
  });

  module.exports = router;
