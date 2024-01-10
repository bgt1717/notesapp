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


// Export the router
export { router as noteRouter };
