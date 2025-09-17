import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// For React Router v6+
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
