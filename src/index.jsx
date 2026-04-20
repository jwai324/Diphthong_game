import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { assertContentBanksOrThrow } from './utils/schema.js';
import './index.css';

assertContentBanksOrThrow();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
