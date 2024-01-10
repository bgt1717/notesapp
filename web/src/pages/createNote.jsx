import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const CreateNote = () => {
  const [cookies, _] = useCookies(["access_token"]);

  const [note, setNote] = useState({
    title: "",
    lines: [{ content: "" }], // Start with an empty line object
    createdAt: new Date(),
  });

  const navigate = useNavigate();

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
      alert("Note Created");
      navigate("/savednotes");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create-note">
      <h2>Create Note</h2>
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
