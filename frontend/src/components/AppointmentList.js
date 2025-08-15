import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await axios.put(`/api/appointments/${appointmentId}/cancel`);
      toast.success(response.data.message);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling appointment');
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`/api/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      toast.success(response.data.message);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating appointment status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Appointments</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="statusFilter" style={{ marginRight: '1rem' }}>Filter by status:</label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="table-container">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No appointments found.</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    <div>
                      <strong>
                        {user.role === 'patient' 
                          ? `Dr. ${appointment.doctor.name}` 
                          : appointment.patient.name
                        }
                      </strong>
                      {user.role === 'patient' && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {appointment.doctor.specialization}
                        </div>
                      )}
                      {user.role === 'doctor' && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          Age: {appointment.patient.age}, {appointment.patient.gender}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{formatDateTime(appointment.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="btn btn-danger"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          >
                            Cancel
                          </button>
                          
                          {user.role === 'doctor' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                              className="btn btn-success"
                              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                            >
                              Complete
                            </button>
                          )}
                        </>
                      )}
                      
                      {appointment.notes && (
                        <button
                          onClick={() => alert(`Notes: ${appointment.notes}`)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          Notes
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;