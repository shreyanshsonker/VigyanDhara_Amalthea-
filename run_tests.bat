@echo off
echo Expense Management System - Test Runner
echo =====================================
echo.

echo 1. Checking if Django server is running...
python check_server.py
if %errorlevel% neq 0 (
    echo.
    echo Starting Django server...
    cd backend
    start "Django Server" cmd /k "python manage.py runserver"
    cd ..
    
    echo Waiting for server to start...
    timeout /t 5 /nobreak > nul
    
    echo Testing again...
    python check_server.py
)

echo.
echo 2. Opening frontend in browser...
start http://localhost:5173

echo.
echo 3. Opening API test page...
start test_frontend_api.html

echo.
echo Test setup complete!
echo.
echo Available test credentials:
echo TechCorp Solutions:
echo   Admin: admin@techcorp.com / admin123
echo   Manager: manager@techcorp.com / manager123
echo   Employee: employee1@techcorp.com / employee123
echo.
echo FinanceFirst Inc:
echo   Admin: admin@financefirst.com / admin123
echo   Manager: manager@financefirst.com / manager123
echo   Employee: employee1@financefirst.com / employee123
echo.
pause
