import React from "react";
import Dashboard from "./components/Dashboard";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log(VITE_BACKEND_URL);
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard apiUrl={VITE_BACKEND_URL} />
    </div>
  );
}

export default App;
