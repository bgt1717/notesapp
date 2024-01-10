// models/Notes.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lines: [
    {
      content: { type: String, maxlength: 50, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  userOwner: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
});

export const NoteModel = mongoose.model("Note", NoteSchema);
