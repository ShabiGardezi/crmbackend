const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user_Id : {
        type: String,
    },
    user_name: {
        type: String,
    },
    dueDate: {
        type: String,
        required: true,
    },
    majorAssignee: {
        type: String,
    },
    majorAssigneeId: {
        type: String,
    },
    assignorDepartment: {
        type: String,
    },
    createdAt: {
        type: Date, // Use the Date data type for createdAt
        default: ()=> new Date()
    },
});
module.exports = mongoose.model("notification", NotificationSchema);
