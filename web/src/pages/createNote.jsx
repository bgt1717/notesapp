// components/CreateNote.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
// import { useGetUserID } from "../hooks/useGetUserID";

const CreateNote = () => {
  const [cookies, _] = useCookies(["access_token"]);
  // const userID = useGetUserID();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    lines: [{ content: "" }],
    createdAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote({ ...note, [name]: value });
  };

  const handleLineChange = (event, idx) => {
    const { value } = event.target;
    const truncatedValue = value.slice(0, 50); // Keep only the first 50 characters
    const lines = [...note.lines];
    lines[idx] = { content: truncatedValue };
    setNote({ ...note, lines });
  };

  const addLine = () => {
    setNote({ ...note, lines: [...note.lines, { content: "" }] });
  };
  
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      //"http://localhost:3001/notes/create-note"
      //https://notesbackend-luyt.onrender.com
      await axios.post("https://notesbackend-luyt.onrender.com/notes/create-note", note, {
        headers: { authorization: cookies.access_token },
      });

      alert("Note created successfully!");
      navigate("/savedNotes"); // Redirect to the "savedNotes" page
    } catch (err) {
      console.error(err);
      alert("Note creation failed. Please try again.");
    }
  };

  return (
    <div className="create-note">
      <div className="form-container">
        <h3 className="titleform">Create Note:</h3>
        <form className="form-titlelines" onSubmit={onSubmit}>
          <label className="title" htmlFor="title">
            Title
          </label>
          <input type="text" id="title" name="title" onChange={handleChange} />

          <label className="title" htmlFor="lines">
            Lines:
          </label>
          <ul>
            {note.lines.map((line, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  name="lines"
                  placeholder={`Line ${idx + 1}`}
                  value={line.content}
                  onChange={(event) => handleLineChange(event, idx)}
                />
              </li>
            ))}
          </ul>

          <button className="formbutton" type="button" onClick={addLine}>
            Add Line
          </button>

          <button className="formbutton" type="submit">
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;

