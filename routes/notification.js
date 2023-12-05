const router = require("express").Router();
const Notifications = require("../schemas/notification");
const Departments = require("../schemas/departments");
const User = require("../schemas/users");

router.get("/all", async (req, res)=>{
   try {
       const {majorAssigneeId}= req.body;
       const result = await Notifications.find({majorAssigneeId: majorAssigneeId});
       console.log('Found documents:', result);
       if (!result)
           return res
               .status(500)
               .json({payload: "", message: "No result something went wrong"});

       return res.status(200).json({payload: result, message: "notification saved"});
   }catch (error) {
       return res
           .status(500)
           .json({payload: "", message: "something went wrong"});
   }
});
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            assignorDepartmentId,
            majorAssigneeId,
            dueDate
        } = req.body;

        const assignorDepartment = await Departments.findById(assignorDepartmentId);
        const majorAssignee = await Departments.findById(majorAssigneeId);
        const user = await User.findById(userId);
        const userName = user.username;
        const assignorDepartmentName = assignorDepartment.name;
        const majorAssigneeName = majorAssignee.name;

        const newNotification = new Notifications({
            user_Id: userId,
            user_name: userName,
            majorAssignee: majorAssigneeName,
            assignorDepartment: assignorDepartmentName,
            dueDate: dueDate,
            majorAssigneeId: majorAssigneeId,

        });
        const savedNotification = await newNotification.save();
        if (!savedNotification)
            return res
                .status(500)
                .json({payload: "", message: "Not Saved something went wrong"});

        return res.status(200).json({payload: savedNotification, message: "notification saved"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

module.exports = router;
