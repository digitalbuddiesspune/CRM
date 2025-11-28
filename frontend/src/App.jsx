import React from 'react';
import Dashboard from './components/Dashboard';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <Dashboard apiUrl={API_BASE_URL} />
  );
}

export default App
