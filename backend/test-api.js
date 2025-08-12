// Simple API test script
// Run with: node test-api.js (after starting the server)

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing Hospital Appointment System API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);
    console.log('');

    // Test user registration
    console.log('2. Testing user registration...');
    const doctorData = {
      name: 'Dr. Test Doctor',
      email: 'test.doctor@example.com',
      password: 'password123',
      role: 'doctor',
      phone: '1234567890',
      gender: 'male',
      specialization: 'General Medicine',
      experience: 5
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, doctorData);
      console.log('✅ Doctor registration successful');
      console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');
      
      // Store token for further tests
      const token = registerResponse.data.token;
      
      // Test getting doctors
      console.log('\n3. Testing get doctors endpoint...');
      const doctorsResponse = await axios.get(`${BASE_URL}/users/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Doctors fetched:', doctorsResponse.data.count, 'doctors found');
      
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  Doctor already registered (this is expected if running multiple times)');
        
        // Try to login instead
        console.log('\n3. Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: doctorData.email,
          password: doctorData.password
        });
        console.log('✅ Login successful');
        
        const token = loginResponse.data.token;
        
        // Test getting doctors
        console.log('\n4. Testing get doctors endpoint...');
        const doctorsResponse = await axios.get(`${BASE_URL}/users/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Doctors fetched:', doctorsResponse.data.count, 'doctors found');
        
      } else {
        throw regError;
      }
    }

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\nYou can now:');
    console.log('- Start the frontend: cd frontend && npm start');
    console.log('- Access the application at: http://localhost:3000');

  } catch (error) {
    console.error('❌ API test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to server. Make sure the backend server is running on port 5000');
      console.error('Start the server with: cd backend && npm run dev');
    } else {
      console.error('Error:', error.response?.data || error.message);
    }
  }
}

// Check if axios is available
try {
  testAPI();
} catch (error) {
  console.error('❌ axios not found. Please install dependencies first:');
  console.error('cd backend && npm install');
}