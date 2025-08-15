import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const appointmentsResponse = await axios.get('/api/appointments');
      const appointments = appointmentsResponse.data.data;

      // Calculate statistics
      const stats = {
        totalAppointments: appointments.length,
        scheduledAppointments: appointments.filter(apt => apt.status === 'scheduled').length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
        cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length
      };

      setStats(stats);
      
      // Get recent appointments (last 5)
      const recent = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setRecentAppointments(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {user.name}!
        </h1>
        <p className="dashboard-subtitle">
          {user.role === 'patient' 
            ? 'Manage your appointments and health records' 
            : 'Manage your patient appointments and schedule'
          }
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Appointments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
            {stats.totalAppointments}
          </p>
          <Link to="/appointments" className="btn btn-primary">
            View All
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Scheduled</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.scheduledAppointments}
          </p>
          <Link to="/appointments?status=scheduled" className="btn btn-warning">
            View Scheduled
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.completedAppointments}
          </p>
          <Link to="/appointments?status=completed" className="btn btn-success">
            View Completed
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Cancelled</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.cancelledAppointments}
          </p>
          <Link to="/appointments?status=cancelled" className="btn btn-danger">
            View Cancelled
          </Link>
        </div>
      </div>

      {user.role === 'patient' && (
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Book New Appointment</h3>
            <p>Schedule an appointment with available doctors</p>
            <Link to="/book-appointment" className="btn btn-primary">
              Book Appointment
            </Link>
          </div>
        </div>
      )}

      {recentAppointments.length > 0 && (
        <div className="table-container">
          <h3 style={{ padding: '1rem', margin: 0, backgroundColor: '#f8f9fa' }}>
            Recent Appointments
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>{user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    {user.role === 'patient' 
                      ? appointment.doctor.name 
                      : appointment.patient.name
                    }
                  </td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;