# Expense Management System - Testing Instructions

## Overview
This document provides step-by-step instructions to test the multi-tenant expense management system with company-based login and role-based access control.

## Prerequisites
- Python 3.8+ installed
- Django 4.2+ installed
- Node.js and npm installed
- Git installed

## Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Load test data:**
   ```bash
   python manage.py load_test_data
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Test Data

The system comes with pre-loaded test data including 3 companies and users:

### TechCorp Solutions
- **Admin:** admin@techcorp.com / admin123
- **Manager:** manager@techcorp.com / manager123
- **Employee 1:** employee1@techcorp.com / employee123
- **Employee 2:** employee2@techcorp.com / employee123

### FinanceFirst Inc
- **Admin:** admin@financefirst.com / admin123
- **Manager:** manager@financefirst.com / manager123
- **Employee 1:** employee1@financefirst.com / employee123
- **Employee 2:** employee2@financefirst.com / employee123

### Global Manufacturing Co
- **Admin:** admin@globalmfg.com / admin123
- **Manager:** manager@globalmfg.com / manager123
- **Employee 1:** employee1@globalmfg.com / employee123
- **Employee 2:** employee2@globalmfg.com / employee123

## Testing the Login Flow

### 1. Company Selection
1. Open `http://localhost:5173` in your browser
2. You should see the login page with a 3-step process
3. **Step 1:** Select a company from the dropdown
4. Click "Next"

### 2. Role Selection
1. **Step 2:** Select your role (Admin, Manager, or Employee)
2. You should see available users for that role in the selected company
3. Click "Next"

### 3. Credentials Entry
1. **Step 3:** Enter your email and password
2. Use one of the test credentials from above
3. Click "Sign In"

### 4. Dashboard Access
- **Admins** will be redirected to `/admin-dashboard`
- **Managers** will be redirected to `/manager-dashboard`
- **Employees** will be redirected to `/employee-dashboard`

## Testing API Endpoints

### 1. Test Companies Endpoint
```bash
curl http://localhost:8000/api/companies/login/companies/
```

### 2. Test Company Users Endpoint
```bash
curl http://localhost:8000/api/companies/login/companies/1/users/
```

### 3. Test Login Endpoint
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techcorp.com",
    "password": "admin123",
    "company_id": 1,
    "role": "admin"
  }'
```

## Testing Role-Based Access

### 1. Employee Access
- Login as an employee
- Should only see their own expenses
- Cannot access admin or manager dashboards

### 2. Manager Access
- Login as a manager
- Should see expenses from their subordinates and their own
- Can access manager dashboard and approval workflow

### 3. Admin Access
- Login as an admin
- Should see all expenses in their company
- Can access admin dashboard and all features

## Testing Company Registration

1. Click "Create your company account" on the login page
2. Fill out the 3-step registration form:
   - **Step 1:** Company information
   - **Step 2:** Admin account details
   - **Step 3:** Configuration settings
3. Complete registration
4. You should be automatically logged in as the admin

## Troubleshooting

### Common Issues

1. **"Failed to load companies" error:**
   - Make sure Django server is running on port 8000
   - Check if test data was loaded successfully
   - Verify CORS settings in Django

2. **"Create company error":**
   - Check if all required fields are filled
   - Verify API endpoints are working
   - Check Django logs for errors

3. **Login not working:**
   - Verify company and role selection
   - Check if user exists in the selected company
   - Verify password is correct

### Debug Mode

The login form includes debug information that shows:
- Number of companies loaded
- Number of users loaded for selected company
- Current API call status
- Error messages

### API Testing

Use the provided `test_frontend_api.html` file to test API endpoints:
1. Open `test_frontend_api.html` in your browser
2. Click the test buttons to verify endpoints
3. Check the results for any errors

## File Structure

```
backend/
├── apps/
│   ├── accounts/
│   │   ├── management/commands/
│   │   │   └── load_test_data.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── companies/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   └── ...
├── test_data.json
└── test_api.py

src/
├── pages/login/
│   ├── components/
│   │   ├── CompanyRoleLoginForm.jsx
│   │   └── DebugLoginForm.jsx
│   └── index.jsx
└── ...

test_frontend_api.html
start_server.bat
start_server.ps1
```

## Next Steps

1. Test all user roles and their permissions
2. Create expenses and test the approval workflow
3. Test company registration with different data
4. Verify data isolation between companies
5. Test error handling and edge cases

## Support

If you encounter any issues:
1. Check the Django logs in `backend/logs/django.log`
2. Check browser console for JavaScript errors
3. Verify all dependencies are installed correctly
4. Ensure both servers are running on the correct ports
