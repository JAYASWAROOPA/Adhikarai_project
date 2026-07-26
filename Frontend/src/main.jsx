import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CustomThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
