const router = require("express").Router();
const User = require("../schemas/users");
router.get("/usertest", (req, res) => {
  res.send("user test");
});

// const checkRole = (req, res, next) => {
//   const userRole = req.session.User.role; // Assuming you store the user's role in the session

//   if (userRole !== "admin") {
//     return res
//       .status(403)
//       .json({ message: "Forbidden. Only admin users can add new users." });
//   }

//   next();
// };

// ADD USER
// router.post("/signup", checkRole, async (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword,
//     email: req.body.email,
//     role: req.body.role,
//     department: req.body.department,
//   });

//   try {
//     const saveduser = await newUser.save();
//     res.status(201).json({ message: "Signup successful", payload: saveduser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

router.post("/signup", async (req, res) => {
  // Your existing signup route logic goes here
  // Only users with admin role can reach this point
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      email: req.body.email,
      role: req.body.role,
      department: req.body.department,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Signup successful", payload: savedUser });
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
