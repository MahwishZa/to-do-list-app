import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  const isAuthenticated = localStorage.getItem('userId'); 

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow">
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;