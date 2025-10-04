@echo off
echo Starting Expense Management System...
echo.

echo 1. Loading test data...
cd backend
python manage.py load_test_data
if %errorlevel% neq 0 (
    echo Error loading test data. Make sure Python and Django are installed.
    pause
    exit /b 1
)

echo.
echo 2. Starting Django server...
python manage.py runserver
if %errorlevel% neq 0 (
    echo Error starting Django server.
    pause
    exit /b 1
)
