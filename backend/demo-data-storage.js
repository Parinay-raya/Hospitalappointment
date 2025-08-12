// MongoDB Data Storage Demonstration
// Run with: node demo-data-storage.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Appointment = require('./models/Appointment');

async function demonstrateDataStorage() {
  try {
    console.log('🚀 MongoDB Data Storage Demonstration\n');
    
    // Step 1: Connect to MongoDB
    console.log('Step 1: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment');
    console.log('✅ Connected to MongoDB\n');
    
    // Step 2: Create a Doctor
    console.log('Step 2: Creating a Doctor...');
    const doctorData = {
      name: 'Dr. Demo Doctor',
      email: 'demo.doctor@hospital.com',
      password: await bcrypt.hash('password123', 10),
      role: 'doctor',
      phone: '555-DEMO-DOC',
      gender: 'male',
      specialization: 'General Medicine',
      experience: 5
    };
    
    // Check if doctor already exists
    let doctor = await User.findOne({ email: doctorData.email });
    if (!doctor) {
      doctor = new User(doctorData);
      await doctor.save();
      console.log('✅ Doctor created:', doctor.name);
    } else {
      console.log('ℹ️  Doctor already exists:', doctor.name);
    }
    console.log('   Doctor ID:', doctor._id);
    console.log('   Specialization:', doctor.specialization);
    console.log('   Experience:', doctor.experience, 'years\n');
    
    // Step 3: Create a Patient
    console.log('Step 3: Creating a Patient...');
    const patientData = {
      name: 'Demo Patient',
      email: 'demo.patient@email.com',
      password: await bcrypt.hash('password123', 10),
      role: 'patient',
      phone: '555-DEMO-PAT',
      gender: 'female',
      age: 30
    };
    
    let patient = await User.findOne({ email: patientData.email });
    if (!patient) {
      patient = new User(patientData);
      await patient.save();
      console.log('✅ Patient created:', patient.name);
    } else {
      console.log('ℹ️  Patient already exists:', patient.name);
    }
    console.log('   Patient ID:', patient._id);
    console.log('   Age:', patient.age);
    console.log('   Gender:', patient.gender, '\n');
    
    // Step 4: Create an Appointment
    console.log('Step 4: Creating an Appointment...');
    const appointmentData = {
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      appointmentTime: '10:30',
      reason: 'Demo consultation',
      status: 'scheduled',
      notes: 'This is a demonstration appointment'
    };
    
    // Check if appointment already exists
    let appointment = await Appointment.findOne({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime
    });
    
    if (!appointment) {
      appointment = new Appointment(appointmentData);
      await appointment.save();
      console.log('✅ Appointment created');
    } else {
      console.log('ℹ️  Appointment already exists');
    }
    console.log('   Appointment ID:', appointment._id);
    console.log('   Date:', appointment.appointmentDate.toDateString());
    console.log('   Time:', appointment.appointmentTime);
    console.log('   Status:', appointment.status, '\n');
    
    // Step 5: Retrieve and Display Data with Relationships
    console.log('Step 5: Retrieving Data with Relationships...');
    const appointmentWithDetails = await Appointment.findById(appointment._id)
      .populate('patient', '-password')
      .populate('doctor', '-password');
    
    console.log('📋 Complete Appointment Details:');
    console.log('   Patient:', appointmentWithDetails.patient.name, '(Age:', appointmentWithDetails.patient.age + ')');
    console.log('   Doctor:', appointmentWithDetails.doctor.name, '(' + appointmentWithDetails.doctor.specialization + ')');
    console.log('   Date & Time:', appointmentWithDetails.appointmentDate.toDateString(), 'at', appointmentWithDetails.appointmentTime);
    console.log('   Reason:', appointmentWithDetails.reason);
    console.log('   Status:', appointmentWithDetails.status);
    console.log('   Notes:', appointmentWithDetails.notes, '\n');
    
    // Step 6: Show Database Statistics
    console.log('Step 6: Database Statistics...');
    const userCount = await User.countDocuments();
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    const patientCount = await User.countDocuments({ role: 'patient' });
    const appointmentCount = await Appointment.countDocuments();
    const scheduledCount = await Appointment.countDocuments({ status: 'scheduled' });
    
    console.log('📊 Database Statistics:');
    console.log('   Total Users:', userCount);
    console.log('   Doctors:', doctorCount);
    console.log('   Patients:', patientCount);
    console.log('   Total Appointments:', appointmentCount);
    console.log('   Scheduled Appointments:', scheduledCount, '\n');
    
    // Step 7: Demonstrate Query Operations
    console.log('Step 7: Advanced Query Examples...');
    
    // Find all doctors
    const allDoctors = await User.find({ role: 'doctor' }).select('name specialization experience');
    console.log('👨‍⚕️ All Doctors:');
    allDoctors.forEach(doc => {
      console.log(`   - ${doc.name} (${doc.specialization}, ${doc.experience} years)`);
    });
    
    // Find appointments for today and future
    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: new Date() }
    }).populate('patient doctor', 'name');
    
    console.log('\n📅 Upcoming Appointments:');
    upcomingAppointments.forEach(apt => {
      console.log(`   - ${apt.patient.name} → ${apt.doctor.name} on ${apt.appointmentDate.toDateString()}`);
    });
    
    console.log('\n🎉 Data Storage Demonstration Complete!');
    console.log('\n💡 Key Points:');
    console.log('   ✅ Data is automatically validated by Mongoose schemas');
    console.log('   ✅ Passwords are automatically hashed before storage');
    console.log('   ✅ Relationships between collections work via ObjectId references');
    console.log('   ✅ Timestamps (createdAt, updatedAt) are automatically managed');
    console.log('   ✅ Complex queries and population work seamlessly');
    
    console.log('\n🔍 You can view this data using:');
    console.log('   - MongoDB Compass: mongodb://localhost:27017');
    console.log('   - API endpoints: http://localhost:5000/api/users/all');
    console.log('   - Frontend application: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error during demonstration:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

demonstrateDataStorage();