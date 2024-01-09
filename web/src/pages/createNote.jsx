import React, { useState } from 'react';
import { useGetUserID } from '../hooks/useGetUserID';


const CreateNote = () => {
  const userID = useGetUserID(); // Assuming useGetUserID is a hook returning the user ID

  const [noteContent, setNoteContent] = useState('');

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    // Add logic to submit the note, e.g., make an API request to save the note

    // For demonstration purposes, log the note content and user ID
    console.log('User ID:', userID);
    console.log('Note Content:', noteContent);

    // You can reset the form or perform any other necessary actions
    setNoteContent('');
  };

  return (
    <div>
      <h2>Create Note</h2>
      <form onSubmit={handleNoteSubmit}>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter your note here (max 50 characters per line)"
          rows={4}
          maxLength={200} // Assuming 50 characters per line for 4 lines
          required
        />
        <br />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default CreateNote;
