// Import necessary modules
import express from "express";
import { NoteModel } from "../models/Notes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

// Create a new instance of the Express router
const router = express.Router();

router.get("/get-notes/:userID", verifyToken, async (req, res) => {
  try {
    const userNotes = await NoteModel.find({ userOwner: req.params.userID });
    res.status(200).json({ notes: userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// Create a route to create a new note
router.post("/create-note", verifyToken, async (req, res) => {
  try {
    const { title, lines, createdAt } = req.body;

    const newNote = new NoteModel({
      title,
      lines,
      createdAt,
      userOwner: req.user.id,
    });

    await newNote.save();

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to delete a note
router.delete("/delete-note/:noteID", verifyToken, async (req, res) => {
  try {
    const noteID = req.params.noteID;

    // Check if the note exists and belongs to the logged-in user
    const existingNote = await NoteModel.findOne({ _id: noteID, userOwner: req.user.id });
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    // Delete the note
    await NoteModel.findByIdAndDelete(noteID);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to update a note
router.put("/update-note/:noteID", verifyToken, async (req, res) => {
  try {
    const noteID = req.params.noteID;

    // Check if the note exists and belongs to the logged-in user
    const existingNote = await NoteModel.findOne({ _id: noteID, userOwner: req.user.id });
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    // Update the note with new data
    const { title, lines } = req.body;
    existingNote.title = title;
    existingNote.lines = lines;
    
    await existingNote.save();

    res.status(200).json({ message: "Note updated successfully", note: existingNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// Export the router
export { router as noteRouter };
