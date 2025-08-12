# Hospital Appointment System - Setup Guide

## Quick Start

### Option 1: Using the Batch File (Windows)
1. Double-click `start.bat` to automatically install dependencies and start both servers

### Option 2: Manual Setup

#### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Root (Optional - for concurrent running):**
```bash
npm install
```

#### Step 2: Database Setup

1. **Install MongoDB:**
   - Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud) and update the connection string in `.env`

2. **Start MongoDB:**
   - Windows: MongoDB should start automatically as a service
   - Manual: Run `mongod` in command prompt

#### Step 3: Environment Configuration

1. Navigate to `backend` folder
2. The `.env` file is already created with default values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hospital_appointment
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   ```
3. **Important:** Change the `JWT_SECRET` to a secure random string in production

#### Step 4: Start the Application

**Option A: Start Both Servers Concurrently (from root directory):**
```bash
npm run dev
```

**Option B: Start Servers Separately:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

#### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Testing the Application

### 1. Register Users

**Register a Doctor:**
- Go to http://localhost:3000/register
- Fill in the form with role "Doctor"
- Include specialization and experience

**Register a Patient:**
- Go to http://localhost:3000/register
- Fill in the form with role "Patient"
- Include age

### 2. Login and Test Features

**As a Patient:**
- Login with patient credentials
- Book appointments with available doctors
- View and manage your appointments

**As a Doctor:**
- Login with doctor credentials
- View patient appointments
- Update appointment status (complete/cancel)

### 3. Test API Endpoints

You can test the API using tools like Postman or curl:

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
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

## Project Structure Overview

```
hospital-appointment-system/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── App.js         # Main App component
│   └── public/            # Static files
├── start.bat              # Windows startup script
└── README.md              # Project documentation
```

## Common Issues and Solutions

### 1. MongoDB Connection Error
- **Issue:** Cannot connect to MongoDB
- **Solution:** 
  - Ensure MongoDB is running
  - Check the connection string in `.env`
  - For Windows: Check if MongoDB service is running in Services

### 2. Port Already in Use
- **Issue:** Port 3000 or 5000 already in use
- **Solution:** 
  - Kill the process using the port
  - Or change the port in the respective configuration

### 3. CORS Errors
- **Issue:** Cross-origin requests blocked
- **Solution:** 
  - The backend already includes CORS middleware
  - Ensure both servers are running on correct ports

### 4. JWT Token Issues
- **Issue:** Authentication not working
- **Solution:** 
  - Clear browser localStorage
  - Check if JWT_SECRET is set in `.env`

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **Database Inspection:** Use MongoDB Compass to view database contents
3. **API Testing:** Use Postman collection for comprehensive API testing
4. **Debugging:** Check browser console and server logs for errors

## Production Deployment

1. **Environment Variables:** Update all environment variables for production
2. **Database:** Use MongoDB Atlas or a production MongoDB instance
3. **Build Frontend:** Run `npm run build` in frontend directory
4. **Security:** Implement additional security measures (rate limiting, input validation, etc.)

## Next Steps

After successful setup, you can:
1. Customize the UI/UX design
2. Add more features (email notifications, calendar integration)
3. Implement additional security measures
4. Add comprehensive testing
5. Deploy to cloud platforms (Heroku, Vercel, AWS, etc.)

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure MongoDB is running and accessible
4. Check that all environment variables are set correctly