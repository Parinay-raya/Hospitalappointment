import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    gender: '',
    // Doctor specific fields
    specialization: '',
    experience: '',
    // Patient specific fields
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data based on role
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      gender: formData.gender
    };

    if (formData.role === 'doctor') {
      userData.specialization = formData.specialization;
      userData.experience = parseInt(formData.experience);
    } else {
      userData.age = parseInt(formData.age);
    }

    const result = await register(userData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            id="gender"
            name="gender"
            className="form-select"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {formData.role === 'doctor' && (
          <>
            <div className="form-group">
              <label htmlFor="specialization" className="form-label">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                className="form-input"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="e.g., Cardiology, Neurology, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="experience" className="form-label">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </>
        )}
        
        {formData.role === 'patient' && (
          <div className="form-group">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-input"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;