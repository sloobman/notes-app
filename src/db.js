export const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NotesDB', 1);
  
      request.onerror = (event) => {
        console.error('Ошибка IndexedDB:', event.target.error);
        reject(event.target.error);
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' });
          store.createIndex('byDate', 'date', { unique: false });
        }
      };
    });
  };
  
  export const getAllNotes = async (db) => {
    return new Promise((resolve) => {
      const transaction = db.transaction('notes', 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();
  
      request.onsuccess = () => {
        resolve(request.result || []);
      };
  
      request.onerror = (event) => {
        console.error('Ошибка получения заметок:', event.target.error);
        resolve([]);
      };
    });
  };
  
  export const saveNote = async (db, note) => {
    return new Promise((resolve) => {
      const transaction = db.transaction('notes', 'readwrite');
      const store = transaction.objectStore('notes');
      store.put(note);
  
      transaction.oncomplete = () => {
        resolve();
      };
  
      transaction.onerror = (event) => {
        console.error('Ошибка сохранения:', event.target.error);
        resolve();
      };
    });
  };
  
  export const deleteNote = async (db, id) => {
    return new Promise((resolve) => {
      const transaction = db.transaction('notes', 'readwrite');
      const store = transaction.objectStore('notes');
      store.delete(id);
  
      transaction.oncomplete = () => {
        resolve();
      };
  
      transaction.onerror = (event) => {
        console.error('Ошибка удаления:', event.target.error);
        resolve();
      };
    });
  };