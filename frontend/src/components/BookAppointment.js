import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // Redirect if not a patient
  useEffect(() => {
    if (user && user.role !== 'patient') {
      navigate('/dashboard');
      return;
    }
    fetchDoctors();
  }, [user, navigate]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/users/doctors');
      setDoctors(response.data.data);
    } catch (error) {
      toast.error('Error fetching doctors');
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/appointments/book', formData);
      toast.success(response.data.message);
      navigate('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (doctorsLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Book New Appointment</h2>
      
      {doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No doctors available at the moment.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctorId" className="form-label">Select Doctor</label>
            <select
              id="doctorId"
              name="doctorId"
              className="form-select"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name} - {doctor.specialization} ({doctor.experience} years exp.)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              className="form-input"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime" className="form-label">Appointment Time</label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              className="form-select"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reason" className="form-label">Reason for Visit</label>
            <input
              type="text"
              id="reason"
              name="reason"
              className="form-input"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Brief description of your concern"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information you'd like to share"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Booking Appointment...' : 'Book Appointment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookAppointment;