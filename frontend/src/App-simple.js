import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookAppointment from './components/BookAppointment';
import AppointmentList from './components/AppointmentList';
import UsersList from './components/UsersList';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/book-appointment" 
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/appointments" 
                element={
                  <ProtectedRoute>
                    <AppointmentList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          {/* ToastContainer temporarily removed for testing */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;