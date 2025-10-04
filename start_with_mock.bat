@echo off
echo Starting Expense Management System with Mock Server...
echo.

echo 1. Installing mock server dependencies...
if not exist node_modules\express (
    npm install express cors --save
)

echo.
echo 2. Starting mock API server...
start "Mock API Server" cmd /k "node mock-server.js"

echo.
echo 3. Waiting for mock server to start...
timeout /t 3 /nobreak > nul

echo.
echo 4. Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 5. Opening application in browser...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo System started successfully!
echo.
echo Available services:
echo - Frontend: http://localhost:5173
echo - Mock API: http://localhost:8001
echo.
echo Test credentials:
echo TechCorp Solutions:
echo   Admin: admin@techcorp.com / admin123
echo   Manager: manager@techcorp.com / admin123
echo   Employee: employee1@techcorp.com / admin123
echo.
echo FinanceFirst Inc:
echo   Admin: admin@financefirst.com / admin123
echo   Manager: manager@financefirst.com / admin123
echo   Employee: employee1@financefirst.com / admin123
echo.
pause
