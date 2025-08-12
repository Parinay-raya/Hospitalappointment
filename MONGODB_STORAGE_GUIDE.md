# 📊 MongoDB Data Storage - Complete Guide

## 🎯 Overview
This guide explains how to store data in MongoDB for the Hospital Appointment System, from basic setup to advanced operations.

## 📋 **Step 1: MongoDB Installation & Verification**

### A. Check if MongoDB is Installed
```bash
cd D:\Hospitalappointment\backend
npm run check-db
```

### B. Install MongoDB (if not installed)
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service (Windows Services → MongoDB Server)

### C. Alternative: Use MongoDB Atlas (Cloud)
1. Sign up at: https://www.mongodb.com/atlas
2. Create a free cluster
3. Update `.env` file with Atlas connection string

## 📋 **Step 2: Database Connection Setup**

### Current Configuration (already done):
```javascript
// backend/server.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));
```

### Environment Variables (already configured):
```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/hospital_appointment
```

## 📋 **Step 3: Data Models (Schemas)**

### A. User Model (Patients & Doctors)
```javascript
// backend/models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  // Doctor-specific fields
  specialization: { type: String, required: function() { return this.role === 'doctor'; }},
  experience: { type: Number, required: function() { return this.role === 'doctor'; }},
  
  // Patient-specific fields
  age: { type: Number, required: function() { return this.role === 'patient'; }}
}, { timestamps: true });
```

### B. Appointment Model
```javascript
// backend/models/Appointment.js
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });
```

## 📋 **Step 4: Data Storage Operations**

### A. Create/Register User (POST)
```javascript
// backend/routes/auth.js
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, gender, specialization, experience, age } = req.body;
    
    // Create user object
    const userData = { name, email, password, role, phone, gender };
    
    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.experience = experience;
    } else {
      userData.age = age;
    }
    
    // Save to MongoDB
    const user = new User(userData);
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### B. Book Appointment (POST)
```javascript
// backend/routes/appointments.js
router.post('/book', async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;
    
    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      notes
    });
    
    // Save to MongoDB
    await appointment.save();
    
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### C. Retrieve Data (GET)
```javascript
// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', '-password')  // Join with User collection
      .populate('doctor', '-password')
      .sort({ appointmentDate: 1 });
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### D. Update Data (PUT)
```javascript
// Cancel appointment
router.put('/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## 📋 **Step 5: Testing Data Storage**

### A. Using the Seeder Script
```bash
cd D:\Hospitalappointment\backend
npm run seed
```

This will create:
- 4 sample doctors
- 4 sample patients  
- 4 sample appointments

### B. Manual Testing via API
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john@example.com",
    "password": "password123",
    "role": "doctor",
    "phone": "1234567890",
    "gender": "male",
    "specialization": "Cardiology",
    "experience": 10
  }'
```

### C. Using Frontend Application
1. Start the application: `npm start` (frontend)
2. Go to: http://localhost:3000/register
3. Fill the registration form
4. Data will be automatically stored in MongoDB

## 📋 **Step 6: Viewing Stored Data**

### A. Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `hospital_appointment`
4. View collections: `users`, `appointments`

### B. Using MongoDB Shell
```bash
# Connect to MongoDB
mongo

# Switch to database
use hospital_appointment

# View all users
db.users.find().pretty()

# View all appointments
db.appointments.find().pretty()

# Count documents
db.users.countDocuments()
db.appointments.countDocuments()
```

### C. Using API Endpoints
```bash
# Get all users (need authentication token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/users/all

# Get all appointments
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/appointments
```

## 📋 **Step 7: Data Validation & Security**

### A. Schema Validation (already implemented)
```javascript
// Automatic validation based on schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
});
```

### B. Password Hashing (already implemented)
```javascript
// Automatic password hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

## 📋 **Step 8: Advanced Operations**

### A. Complex Queries
```javascript
// Find appointments for a specific date range
const appointments = await Appointment.find({
  appointmentDate: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  }
}).populate('doctor patient');

// Find doctors by specialization
const cardiologists = await User.find({
  role: 'doctor',
  specialization: 'Cardiology'
});
```

### B. Aggregation Pipeline
```javascript
// Get appointment statistics
const stats = await Appointment.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);
```

## 📋 **Step 9: Practical Examples**

### Example 1: Register a Doctor
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Dr. Sarah Wilson",
  "email": "sarah@hospital.com",
  "password": "securepass123",
  "role": "doctor",
  "phone": "555-0123",
  "gender": "female",
  "specialization": "Pediatrics",
  "experience": 8
}
```

### Example 2: Book an Appointment
```bash
POST http://localhost:5000/api/appointments/book
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "doctorId": "DOCTOR_OBJECT_ID",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "reason": "Regular checkup",
  "notes": "Patient has history of hypertension"
}
```

## 📋 **Step 10: Troubleshooting**

### Common Issues & Solutions:

#### A. Connection Failed
```bash
# Check if MongoDB is running
cd backend
npm run check-db
```

#### B. Validation Errors
- Check required fields in schema
- Ensure data types match
- Verify unique constraints

#### C. Authentication Issues
- Ensure JWT token is valid
- Check Authorization header format
- Verify user permissions

## 🎯 **Quick Start Commands**

```bash
# 1. Check MongoDB connection
cd D:\Hospitalappointment\backend
npm run check-db

# 2. Seed sample data
npm run seed

# 3. Start backend server
npm run dev

# 4. Start frontend (new terminal)
cd ..\frontend
npm start

# 5. Test the application
# Go to: http://localhost:3000
# Register users and book appointments
```

## ✅ **Success Indicators**

Data is being stored correctly when:
- ✅ Registration creates new user documents
- ✅ Login retrieves user from database
- ✅ Appointments are saved with proper relationships
- ✅ Data persists after server restart
- ✅ MongoDB Compass shows the data
- ✅ API endpoints return stored data

---

**Your MongoDB data storage is fully configured and ready to use! Follow the steps above to store and retrieve data effectively.** 🎯