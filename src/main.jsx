import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './policy.css';
import PolicyPlaygroundPage from './PolicyPlaygroundPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PolicyPlaygroundPage />
  </StrictMode>,
);
