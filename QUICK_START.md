# Quick Start Guide

## 🚀 Fast Setup (No Django Required)

If you want to test the system quickly without setting up Django:

### Option 1: Windows Batch File
```bash
start_with_mock.bat
```

### Option 2: PowerShell
```powershell
.\start_with_mock.ps1
```

### Option 3: Manual Setup
```bash
# 1. Install mock server dependencies
npm install express cors

# 2. Start mock API server (in one terminal)
node mock-server.js

# 3. Start frontend (in another terminal)
npm run dev
```

## 🎯 What This Gives You

- **Frontend**: http://localhost:5173
- **Mock API**: http://localhost:8001
- **3 Test Companies** with users
- **Full Login Flow** with company selection
- **Create Company** functionality
- **Role-based Access** (Admin/Manager/Employee)

## 🔑 Test Credentials

### TechCorp Solutions
- **Admin**: admin@techcorp.com / admin123
- **Manager**: manager@techcorp.com / admin123
- **Employee**: employee1@techcorp.com / admin123

### FinanceFirst Inc
- **Admin**: admin@financefirst.com / admin123
- **Manager**: manager@financefirst.com / admin123
- **Employee**: employee1@financefirst.com / admin123

### Global Manufacturing Co
- **Admin**: admin@globalmfg.com / admin123
- **Manager**: manager@globalmfg.com / admin123
- **Employee**: employee1@globalmfg.com / admin123

## 🧪 Testing the System

1. **Open** http://localhost:5173
2. **Select** a company from the dropdown
3. **Choose** your role (Admin/Manager/Employee)
4. **Enter** your credentials
5. **Access** the appropriate dashboard

## ➕ Creating New Companies

1. On the login page, click **"Create New Company"**
2. Fill out the 3-step registration form
3. You'll be automatically logged in as the admin

## 🔧 Troubleshooting

- **"Failed to load companies"**: The mock server should handle this automatically
- **No companies showing**: Check if mock server is running on port 8001
- **Login not working**: Make sure you're using the correct email/role combination

## 📁 Files Created

- `mock-server.js` - Mock API server
- `start_with_mock.bat` - Windows startup script
- `start_with_mock.ps1` - PowerShell startup script
- Updated API service with fallback support

The system now works completely offline with mock data!
