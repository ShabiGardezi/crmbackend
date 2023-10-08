const router = require("express").Router();
const Notes = require("../schemas/notes");

router.get("/", async (req, res) => {
  // get notes
  try {
    const { userId } = req.params;
    const notes = await Notes.find({ user_id: userId });

    return res.status(200).json({ payload: notes, message: "notes fetched" });
  } catch (error) {
    return res
      .status(500)
      .json({ payload: "", message: "something went wronge" });
  }
});

router.post("/", async (req, res) => {
  // create a new note
  try {
    const { userId, note } = req.body;
    const newNote = new Notes({
      user_id: userId,
      note: note,
    });
    const savedNote = await newNote.save();
    if (!savedNote)
      return res
        .status(500)
        .json({ payload: "", message: "something went wronge" });

    return res.status(200).json({ payload: savedNote, message: "note saved" });
  } catch (error) {
    return res
      .status(500)
      .json({ payload: "", message: "something went wronge" });
  }
});

router.delete("/", async (req, res) => {
  // delete a  note
  try {
    const { noteId } = req.params;
    const deletedNote = await Notes.findByIdAndDelete(noteId);
    if (!deletedNote)
      return res
        .status(500)
        .json({ payload: "", message: "something went wronge" });

    return res
      .status(200)
      .json({ payload: deletedNote, message: "note deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ payload: "", message: "something went wronge" });
  }
});

router.delete("/all", async (req, res) => {
  // delete all notes of a user
  try {
    const { userId } = req.params;
    await Notes.deleteMany({ user_id: userId });

    return res.status(200).json({ payload: "", message: "notes deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ payload: "", message: "something went wronge" });
  }
});

module.exports = router;
