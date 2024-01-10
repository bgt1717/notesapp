// routes/notes.js
import express from "express";
import { NoteModel } from "../models/Notes.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// Create a new note
router.post("/create-note", verifyToken, async (req, res) => {
  try {
    const { title, lines, createdAt } = req.body;

    const newNote = new NoteModel({
      title,
      lines,
      createdAt,
    });

    await newNote.save();

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Fetch all notes
router.get("/get-notes", verifyToken, async (req, res) => {
  try {
    const notes = await NoteModel.find();
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export { router as noteRouter };

