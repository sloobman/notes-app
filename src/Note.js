import React, { useState } from 'react';
import './Note.css';

function Note({ note, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);

  const handleUpdate = () => {
    onUpdate(note.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="note">
      {isEditing ? (
        <>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-textarea"
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </>
      ) : (
        <>
          <div className="note-text">{note.text}</div>
          <div className="note-date">{note.date}</div>
          <div className="note-actions">
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
            <button onClick={() => onDelete(note.id)}>Удалить</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;