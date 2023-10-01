const router = require("express").Router();
const Departments = require("../schemas/departments");

router.get("/", async (req, res) => {
  // get departments

  const departments = await Departments.find({});

  return res
    .status(200)
    .json({ payload: departments, message: "departments fetched" });
});

module.exports = router;
