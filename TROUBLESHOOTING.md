# Hospital Appointment System - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. React Router Future Flag Warnings

**Issue:** Warnings about `v7_startTransition` and `v7_relativeSplatPath`

**Solution:** ✅ **FIXED** - Updated App.js with future flags:
```javascript
<Router
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }}
>
```

### 2. Backend 500 Internal Server Error

**Issue:** API calls returning 500 status code

**Possible Causes & Solutions:**

#### A. MongoDB Not Running
```bash
# Check if MongoDB is running
cd backend
npm run check-db
```

**If MongoDB is not installed:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service

**If MongoDB is installed but not running:**
- Windows: Check Services → Start "MongoDB Server"
- Manual start: Open command prompt and run `mongod`

#### B. Environment Variables Missing
Check if `.env` file exists in backend folder with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_appointment
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

#### C. Dependencies Not Installed
```bash
cd backend
npm install
```

### 3. React Component Import/Export Errors

**Issue:** "Element type is invalid" error

**Solution:** ✅ **FIXED** - Added ErrorBoundary component to catch and display errors gracefully.

**If you still see this error:**
1. Check all component files have proper `export default ComponentName`
2. Check all imports match the exported names
3. Clear browser cache and restart development server

### 4. Frontend Not Loading

**Issue:** Frontend shows blank page or errors

**Solutions:**

#### A. Dependencies Not Installed
```bash
cd frontend
npm install
```

#### B. Port Conflicts
- Frontend runs on port 3000
- Backend runs on port 5000
- Make sure both ports are available

#### C. Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear

### 5. CORS Errors

**Issue:** Cross-origin request blocked

**Solution:** ✅ **FIXED** - Backend includes CORS middleware and frontend has proxy configuration.

**If you still see CORS errors:**
1. Make sure backend server is running on port 5000
2. Check frontend package.json has: `"proxy": "http://localhost:5000"`

## 🔧 Diagnostic Commands

### Check MongoDB Connection
```bash
cd backend
npm run check-db
```

### Test Backend API
```bash
cd backend
npm run test
```

### Check Backend Health
Open browser: http://localhost:5000/api/health

### Check Frontend Build
```bash
cd frontend
npm run build
```

## 🚀 Step-by-Step Startup Process

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Check MongoDB
```bash
cd backend
npm run check-db
```

### 3. Start Backend
```bash
cd backend
npm run dev
```
Should show:
- "Server is running on port 5000"
- "MongoDB connected successfully"

### 4. Start Frontend
```bash
cd frontend
npm start
```
Should open browser at http://localhost:3000

### 5. Test the Application
1. Go to http://localhost:3000/register
2. Register a new user (doctor or patient)
3. Login with the credentials
4. Navigate through the application

## 🐛 Debugging Tips

### Backend Debugging
1. Check server console for error messages
2. Test API endpoints with Postman or curl
3. Check MongoDB connection status
4. Verify environment variables

### Frontend Debugging
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed API calls
4. Check Application tab for localStorage issues

### Database Debugging
1. Use MongoDB Compass to view database
2. Check if collections are created
3. Verify data is being saved correctly

## 📋 Pre-flight Checklist

Before starting the application, ensure:

- [ ] Node.js is installed (v14 or higher)
- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Environment variables configured (`.env` file in backend)
- [ ] Ports 3000 and 5000 are available
- [ ] No antivirus blocking the applications

## 🆘 Still Having Issues?

### 1. Complete Reset
```bash
# Stop all servers
# Delete node_modules folders
rm -rf backend/node_modules frontend/node_modules

# Reinstall everything
cd backend && npm install
cd ../frontend && npm install

# Restart MongoDB service
# Start backend: npm run dev
# Start frontend: npm start
```

### 2. Check System Requirements
- **Node.js**: v14 or higher
- **MongoDB**: v4.4 or higher
- **RAM**: At least 4GB available
- **Disk Space**: At least 1GB free

### 3. Alternative MongoDB Options
If local MongoDB doesn't work:
1. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas
2. Update MONGODB_URI in .env file with Atlas connection string

### 4. Browser Compatibility
Tested browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Error Reporting

When reporting issues, please include:
1. Operating system and version
2. Node.js version (`node --version`)
3. MongoDB version (`mongod --version`)
4. Complete error message from console
5. Steps to reproduce the issue
6. Browser and version (for frontend issues)

## ✅ Success Indicators

Application is working correctly when:
- Backend shows "MongoDB connected successfully"
- Frontend loads without console errors
- User registration works
- User login works
- Appointments can be booked
- Dashboard shows data correctly

---

**Remember:** Most issues are related to MongoDB not running or dependencies not installed. Always check these first! 🎯