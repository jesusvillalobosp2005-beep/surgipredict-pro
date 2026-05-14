import React from 'react';
import { createRoot } from 'react-dom/client';
import SurgiPredictPro from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SurgiPredictPro />
  </React.StrictMode>
);
