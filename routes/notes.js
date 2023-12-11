const router = require("express").Router();
const Notes = require("../schemas/notes");

router.get("/", async (req, res) => {
    // get notes
    try {
        const {userId} = req.query;
        const notes = await Notes.find({user_id: userId});

        return res.status(200).json({payload: notes, message: "notes fetched"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

router.post("/", async (req, res) => {
    // create a new note
    try {
        const {userId, note, status, date} = req.body;
        const newNote = new Notes({
            user_id: userId,
            note: note,
            status: status,
            date: date,
        });
        const savedNote = await newNote.save();
        if (!savedNote)
            return res
                .status(500)
                .json({payload: "", message: "something went wrong"});

        return res.status(200).json({payload: savedNote, message: "note saved"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

router.put("/update", async (req, res) => {
    const { id,status } = req.body;
    console.log('Received noteID:', id);
    try {
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );
        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.put("/seen", async (req, res) => {
    const { id,seen } = req.body;
    try {
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { seen },
        );
        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json("updated");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/", async (req, res) => {
    // delete a  note
    try {
        const {noteId} = req.query;
        const deletedNote = await Notes.findByIdAndDelete(noteId);
        if (!deletedNote)
            return res
                .status(500)
                .json({payload: "", message: "something went wrong"});

        return res
            .status(200)
            .json({payload: deletedNote, message: "note deleted"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

router.delete("/all", async (req, res) => {
    // delete all notes of a user
    try {
        const {userId} = req.query;
        await Notes.deleteMany({user_id: userId});

        return res.status(200).json({payload: "", message: "notes deleted"});
    } catch (error) {
        return res
            .status(500)
            .json({payload: "", message: "something went wrong"});
    }
});

module.exports = router;
