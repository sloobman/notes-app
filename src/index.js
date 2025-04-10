import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './registerServiceWorker';

// Находим корневой элемент
const container = document.getElementById('root');
// Создаем корень приложения
const root = createRoot(container);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Регистрируем Service Worker
serviceWorkerRegistration.register();