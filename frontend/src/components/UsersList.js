import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/all');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
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
        <h2>Users Directory</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="roleFilter" style={{ marginRight: '1rem' }}>Filter by role:</label>
          <select
            id="roleFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option value="all">All Users</option>
            <option value="doctor">Doctors</option>
            <option value="patient">Patients</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="table-container">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No users found.</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Details</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'doctor' ? 'status-completed' : 'status-scheduled'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td style={{ textTransform: 'capitalize' }}>{user.gender}</td>
                  <td>
                    {user.role === 'doctor' ? (
                      <div>
                        <div><strong>Specialization:</strong> {user.specialization}</div>
                        <div><strong>Experience:</strong> {user.experience} years</div>
                      </div>
                    ) : (
                      <div>
                        <strong>Age:</strong> {user.age} years
                      </div>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Total Users:</strong> {users.length}
          </div>
          <div>
            <strong>Doctors:</strong> {users.filter(u => u.role === 'doctor').length}
          </div>
          <div>
            <strong>Patients:</strong> {users.filter(u => u.role === 'patient').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;