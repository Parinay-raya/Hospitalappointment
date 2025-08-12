// MongoDB connection checker
// Run with: node check-mongodb.js

const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB connection...\n');
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment';
  console.log('📍 Attempting to connect to:', mongoUri);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    console.log('🗄️  Database name:', mongoose.connection.name);
    
    // Test basic operations
    console.log('\n🧪 Testing database operations...');
    
    // List databases
    try {
      const admin = mongoose.connection.db.admin();
      const dbs = await admin.listDatabases();
      console.log('📚 Available databases:', dbs.databases.map(db => db.name).join(', '));
      
      // Check if our database exists
      const ourDb = dbs.databases.find(db => db.name === 'hospital_appointment');
      if (ourDb) {
        console.log('✅ Hospital appointment database found');
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.length > 0) {
          console.log('📋 Collections:', collections.map(col => col.name).join(', '));
        } else {
          console.log('ℹ️  No collections found (will be created when data is added)');
        }
      } else {
        console.log('ℹ️  Hospital appointment database not found (will be created on first use)');
      }
    } catch (adminError) {
      console.log('⚠️  Could not list databases (this is normal for some MongoDB setups)');
    }
    
    console.log('\n🎉 MongoDB is ready for the Hospital Appointment System!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Optionally seed data: npm run seed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('🔴 Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Make sure MongoDB is installed and running');
      console.error('2. On Windows: Check if MongoDB service is running in Services');
      console.error('3. Try starting MongoDB manually: mongod');
      console.error('4. Check if port 27017 is available');
      console.error('5. Install MongoDB from: https://www.mongodb.com/try/download/community');
      console.error('\n🔧 Alternative: Use MongoDB Atlas (cloud)');
      console.error('   - Sign up at: https://www.mongodb.com/atlas');
      console.error('   - Update MONGODB_URI in .env file');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed.');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

checkMongoDB();