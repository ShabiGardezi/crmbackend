const router = require("express").Router();
const Notifications = require("../schemas/notification");
const Departments = require("../schemas/departments");
const User = require("../schemas/users");
const Notes = require("../schemas/notes");

const markRead = async (userDepartment) => {
    try {
        await Notifications.updateMany(
            {
                $or: [
                    {majorAssigneeId: userDepartment},
                ],
            },
            {
                $set: {isRead: true},
            }
        );
    } catch (err) {
        console.error(err.message);
    }
};

router.get("/all", async (req, res) => {
    try {
        const {userId, shouldMark} = req.query;
        const marked = shouldMark ? (shouldMark === "true" ? true : false) : false;
        const user = await User.findById(userId);
        const userDepartment = user.department.toString();
        if (marked) {
            markRead(userDepartment);
        }
        const result = await Notifications.find({
            $or: [
                {majorAssigneeId: userDepartment},
            ],
        });
        const sortedResult = result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
        if (!result)
            return res
                .status(500)
                .json({payload: "", message: "No result something went wrong"});
        return res
            .status(200)
            .json({payload: sortedResult, message: "Data send"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});
router.post("/", async (req, res) => {
    try {
        const {userId, assignorDepartmentId, majorAssigneeId, dueDate, clientName, ticketId} = req.body;

        const assignorDepartment = await Departments.findById(assignorDepartmentId);
        const majorAssignee = await Departments.findById(majorAssigneeId);
        const user = await User.findById(userId);
        const userName = user.username;
        const assignorDepartmentName = assignorDepartment.name;
        const majorAssigneeName = majorAssignee.name;

        const newNotification = new Notifications({
            ticket_Id: ticketId,
            user_Id: userId,
            user_name: userName,
            majorAssignee: majorAssigneeName,
            assignorDepartment: assignorDepartmentName,
            assignorDepartmentId: assignorDepartmentId,
            dueDate: dueDate,
            majorAssigneeId: majorAssigneeId,
            client_name: clientName,
        });
        const savedNotification = await newNotification.save();
        if (!savedNotification)
            return res
                .status(500)
                .json({payload: "", message: "Not Saved something went wrong"});

        return res
            .status(200)
            .json({payload: savedNotification, message: "notification saved"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

router.put("/reportingdate", async (req, res) => {
    try {
        const {notificatonId} = req.body;
        const updateNotificaton = await Notes.findByIdAndUpdate(
            notificatonId,
            {reportingDate},
        );
        if (!updateNotificaton) {
            return res.status(404).json({error: "Note not found"});
        }
        res.json("updated");
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
})
module.exports = router;
