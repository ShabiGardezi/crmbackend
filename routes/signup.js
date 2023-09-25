const router = require("express").Router();
const User = require("../schemas/users");
router.get("/usertest", (req, res) => {
  res.send("user test");
});

// ADD USER
router.post("/signup", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    email: req.body.email,
    role: req.body.role,
  });

  try {
    const saveduser = await newUser.save();
    res.status(201).json({ message: "Signup successful", payload: saveduser });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Update user

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted.....");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get User

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER

router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
