import React, { useState, useEffect } from 'react';
import { initDB, getAllNotes, saveNote, deleteNote } from './db';
import './App.css';
import Note from './Note';

function App() {
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [db, setDb] = useState(null);

  // Инициализация базы данных
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
        
        const loadedNotes = await getAllNotes(database);
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Ошибка инициализации DB:', error);
      }
    };

    initializeDB();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    };
  }, []);

  const addNote = async () => {
    const text = inputValue.trim();
    if (!text || !db) return;

    const newNote = {
      id: Date.now(),
      text,
      date: new Date().toISOString()
    };

    try {
      await saveNote(db, newNote);
      setNotes(prev => [...prev, newNote]);
      setInputValue('');
    } catch (error) {
      console.error('Ошибка добавления заметки:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!db) return;
    
    try {
      await deleteNote(db, id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
    }
  };

  const handleUpdateNote = async (id, newText) => {
    if (!db) return;
    
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return;
      
      const updatedNote = { ...noteToUpdate, text: newText };
      await saveNote(db, updatedNote);
      
      setNotes(prev => 
        prev.map(note => note.id === id ? updatedNote : note)
      );
    } catch (error) {
      console.error('Ошибка обновления заметки:', error);
    }
  };



  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-banner">
          Офлайн-режим. Изменения синхронизируются при восстановлении соединения.
        </div>
      )}
      
      <h1>Мои заметки</h1>
      
      <div className="note-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите текст заметки..."
          rows="3"
        />
        <button onClick={addNote}>Добавить</button>
      </div>
      
      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-message">Нет заметок. Добавьте первую!</p>
        ) : (
          notes.map(note => (
            <Note
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onUpdate={handleUpdateNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;