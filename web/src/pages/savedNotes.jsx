// components/CreateNote.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";

const savedNotes = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();

  const [note, setNote] = useState({
    title: "",
    lines: [{ content: "" }],
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [userNotes, setUserNotes] = useState([]);

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        //http://localhost:3001/notes/get-notes/${userID}`
        //https://notesbackend-luyt.onrender.com
        const url = `https://notesbackend-luyt.onrender.com/notes/get-notes/${userID}`;
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

  // Function to add a line during editing
  const addEditingLine = (userNoteIndex) => {
    setUserNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      const lines = updatedNotes[userNoteIndex].lines;
      if (lines.length === 0 || lines[lines.length - 1].content.trim() !== "") {
        // Add a new line only if the last line is not empty
        updatedNotes[userNoteIndex].lines.push({ content: "" });
      }
      return updatedNotes;
    });
  };
  
  const deleteNote = async (noteID) => {
    try {
        //`http://localhost:3001/notes/delete-note/${noteID}`
        //https://notesbackend-luyt.onrender.com
      await axios.delete(`https://notesbackend-luyt.onrender.com/notes/delete-note/${noteID}`, {
        headers: { authorization: cookies.access_token },
      });

      alert("Note deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Note deletion failed. Please try again.");
    }
  };

  const editNote = (userNoteIndex) => {
    setUserNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      updatedNotes[userNoteIndex].editing = true;
      return updatedNotes;
    });
  };

  const saveChanges = async (userNoteIndex, noteID) => {
    try {
      const editedNote = userNotes[userNoteIndex];

      await axios.put(
        //`http://localhost:3001/notes/update-note/${noteID}`
        //https://notesbackend-luyt.onrender.com
        `https://notesbackend-luyt.onrender.com/notes/update-note/${noteID}`,
        {
          title: editedNote.title,
          lines: editedNote.lines,
        },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      setUserNotes((prevNotes) => {
        const updatedNotes = [...prevNotes];
        updatedNotes[userNoteIndex].editing = false;
        return updatedNotes;
      });

    //   alert("Note updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Note update failed. Please try again.");
    }
  };

  return (
    <div className="create-note">
      <div className="existing-notes">
        <h3 className="title">Existing Notes:</h3>

        {userNotes.map((userNote, userNoteIndex) => (
          <div className="title-lines" key={userNote._id}>
            {userNote.editing ? (
              <div>
                <label htmlFor={`title-${userNote._id}`}>Title:</label>
                <input
                  type="text"
                  id={`title-${userNote._id}`}
                  name={`title-${userNote._id}`}
                  value={userNote.title}
                  onChange={(e) => {
                    setUserNotes((prevNotes) => {
                      const updatedNotes = [...prevNotes];
                      updatedNotes[userNoteIndex].title = e.target.value;
                      return updatedNotes;
                    });
                  }}
                />

                <label htmlFor={`lines-${userNote._id}`}></label>
                <ul>
                  {userNote.lines.map((line, idx) => (
                    <li key={idx}>
                      <input
                        type="text"
                        name={`lines-${userNote._id}`}
                        value={line.content}
                        onChange={(e) => {
                          setUserNotes((prevNotes) => {
                            const updatedNotes = [...prevNotes];
                            updatedNotes[userNoteIndex].lines[idx].content = e.target.value;
                            return updatedNotes;
                          });
                        }}
                      />
                      <button
                        className="formbutton"
                        onClick={() => {
                          setUserNotes((prevNotes) => {
                            const updatedNotes = [...prevNotes];
                            updatedNotes[userNoteIndex].lines.splice(idx, 1); // Remove the line
                            return updatedNotes;
                          });
                        }}
                      >
                        Delete Line
                      </button>
                    </li>
                  ))}
                </ul>

                <button className="formbutton" onClick={() => saveChanges(userNoteIndex, userNote._id)}>
                  Save Changes
                </button>

                <button className="formbutton" onClick={() => addEditingLine(userNoteIndex)}>
                  Add Line
                </button>
              </div>
            ) : (
              <div>
                <div className="title">{userNote.title}</div>
                <ul>
                  {userNote.lines.map((line, idx) => (
                    <li key={idx}>{line.content}</li>
                  ))}
                </ul>

                <button className="formbutton" onClick={() => editNote(userNoteIndex)}>
                  Edit
                </button>

                <button className="formbutton" onClick={() => deleteNote(userNote._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default savedNotes;

