// components/CreateNote.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";

const CreateNote = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();

  const [note, setNote] = useState({
    title: "",
    lines: [{ content: "" }],
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [userNotes, setUserNotes] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const url = `http://localhost:3001/notes/get-notes/${userID}`;
        const response = await axios.get(url, {
          headers: { authorization: cookies.access_token },
        });
        setUserNotes(response.data.notes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserNotes();
  }, [userID, cookies.access_token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote({ ...note, [name]: value });
  };

  const handleLineChange = (event, idx) => {
    const { value } = event.target;
    const lines = [...note.lines];
    lines[idx] = { content: value };
    setNote({ ...note, lines });
  };

  const addLine = () => {
    setNote({ ...note, lines: [...note.lines, { content: "" }] });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/notes/create-note", note, {
        headers: { authorization: cookies.access_token },
      });

      // Update the URL to navigate to the correct endpoint
      alert("Note created successfully!");
      // navigate("/"); // Change this to your desired route
      window.location.reload(); //refreshes page upon success. 
    } catch (err) {
      console.error(err);
      alert("Note creation failed. Please try again.");
    }
  };

  return (
    <div className="create-note">
      <h2>Create Note</h2>
      <div>
        <h3>Your Existing Notes:</h3>
        {userNotes.map((userNote) => (
          <div key={userNote._id}>
            <h4>{userNote.title}</h4>
            <ul>
              {userNote.lines.map((line, idx) => (
                <li key={idx}>{line.content}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" onChange={handleChange} />

        <label htmlFor="lines">Lines</label>
        {note.lines.map((line, idx) => (
          <input
            key={idx}
            type="text"
            name="lines"
            value={line.content}
            onChange={(event) => handleLineChange(event, idx)}
          />
        ))}
        <button type="button" onClick={addLine}>
          Add Line
        </button>

        <button type="submit">Create Note</button>
      </form>
    </div>
  );
};

export default CreateNote;
