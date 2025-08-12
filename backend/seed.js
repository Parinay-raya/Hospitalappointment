// Database seeder script
// Run with: node seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data');

    // Create sample doctors
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '555-0101',
        gender: 'female',
        specialization: 'Cardiology',
        experience: 12
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '555-0102',
        gender: 'male',
        specialization: 'Neurology',
        experience: 8
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '555-0103',
        gender: 'female',
        specialization: 'Pediatrics',
        experience: 15
      },
      {
        name: 'Dr. David Wilson',
        email: 'david.wilson@hospital.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '555-0104',
        gender: 'male',
        specialization: 'Orthopedics',
        experience: 10
      }
    ];

    // Create sample patients
    const patients = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: await bcrypt.hash('password123', 10),
        role: 'patient',
        phone: '555-0201',
        gender: 'male',
        age: 35
      },
      {
        name: 'Mary Johnson',
        email: 'mary.johnson@email.com',
        password: await bcrypt.hash('password123', 10),
        role: 'patient',
        phone: '555-0202',
        gender: 'female',
        age: 28
      },
      {
        name: 'Robert Brown',
        email: 'robert.brown@email.com',
        password: await bcrypt.hash('password123', 10),
        role: 'patient',
        phone: '555-0203',
        gender: 'male',
        age: 42
      },
      {
        name: 'Lisa Davis',
        email: 'lisa.davis@email.com',
        password: await bcrypt.hash('password123', 10),
        role: 'patient',
        phone: '555-0204',
        gender: 'female',
        age: 31
      }
    ];

    // Insert doctors and patients
    const createdDoctors = await User.insertMany(doctors);
    const createdPatients = await User.insertMany(patients);

    console.log(`Created ${createdDoctors.length} doctors`);
    console.log(`Created ${createdPatients.length} patients`);

    // Create sample appointments
    const appointments = [
      {
        patient: createdPatients[0]._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        appointmentTime: '10:00',
        reason: 'Regular checkup',
        status: 'scheduled'
      },
      {
        patient: createdPatients[1]._id,
        doctor: createdDoctors[1]._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        appointmentTime: '14:30',
        reason: 'Headache consultation',
        status: 'scheduled'
      },
      {
        patient: createdPatients[2]._id,
        doctor: createdDoctors[2]._id,
        appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        appointmentTime: '09:00',
        reason: 'Child vaccination',
        status: 'completed'
      },
      {
        patient: createdPatients[3]._id,
        doctor: createdDoctors[3]._id,
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        appointmentTime: '16:00',
        reason: 'Knee pain evaluation',
        status: 'scheduled'
      }
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log(`Created ${createdAppointments.length} appointments`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('\nDoctors:');
    doctors.forEach(doctor => {
      console.log(`  Email: ${doctor.email} | Password: password123 | Specialization: ${doctor.specialization}`);
    });
    console.log('\nPatients:');
    patients.forEach(patient => {
      console.log(`  Email: ${patient.email} | Password: password123 | Age: ${patient.age}`);
    });

    console.log('\nYou can now start the application and login with any of these credentials.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

seedData();