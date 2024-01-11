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

   // Function to delete a note
   const deleteNote = async (noteID) => {
    try {
      await axios.delete(`http://localhost:3001/notes/delete-note/${noteID}`, {
        headers: { authorization: cookies.access_token },
      });

      alert("Note deleted successfully!");
      window.location.reload(); // Refresh the page upon success
    } catch (err) {
      console.error(err);
      alert("Note deletion failed. Please try again.");
    }
  };

    // Function to edit a note
    const editNote = async (noteID) => {
      try {
        // Fetch the existing note data
        const existingNote = userNotes.find((note) => note._id === noteID);
  
        // Prompt user to input new data
        const newTitle = prompt("Enter new title:", existingNote.title);
        const newLines = prompt("Enter new lines (comma-separated):", existingNote.lines.join(","));
        
        // Send a PUT request to update the note
        await axios.put(`http://localhost:3001/notes/update-note/${noteID}`, {
          title: newTitle,
          lines: newLines.split(",").map(line => ({ content: line.trim() })),
        }, {
          headers: { authorization: cookies.access_token },
        });
  
        alert("Note updated successfully!");
        window.location.reload(); // Refresh the page upon success
      } catch (err) {
        console.error(err);
        alert("Note update failed. Please try again.");
      }
    };
  


  return (
    <div className="create-note">
      {/* <h2>Create Note</h2> */}
      <div className="existing-notes">
        <h3 className="title">Your Existing Notes:</h3>
        
        {userNotes.map((userNote) => (
          <div className="title-lines" key={userNote._id}>
            <div className="title">{userNote.title}</div>
            <ul>
              {userNote.lines.map((line, idx) => (
                <li key={idx}>{line.content}</li>
              ))}
            </ul>
            
            {/* Add edit and delete buttons for each note */}
            <button className="formbutton" onClick={() => editNote(userNote._id)}>
              Edit Note
            </button>
            
            <button className="formbutton" onClick={() => deleteNote(userNote._id)}>
              Delete Note
            </button>
          </div>
        ))}
      </div>
      <div className="form-container">
      <form onSubmit={onSubmit}>
      
        <label className="title" htmlFor="title">Title</label>
        <input type="text" id="title" name="title" onChange={handleChange} />

        <label className="title" htmlFor="lines">Lines</label>
        {note.lines.map((line, idx) => (
          <input
            key={idx}
            type="text"
            name="lines"
            value={line.content}
            onChange={(event) => handleLineChange(event, idx)}
          />
        ))}
        
        <button className="formbutton" type="button" onClick={addLine}>
          Add Line
        </button>

        <button className="formbutton" type="submit">Create Note</button>
      </form>
      </div>
    </div>
  );
};

export default CreateNote;
