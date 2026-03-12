import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { AppStateProvider } from './app/providers/AppStateProvider';
import './styles/theme.css';
import './styles/globals.css';
import './styles/motion.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
);
