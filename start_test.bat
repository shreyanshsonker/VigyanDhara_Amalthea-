@echo off
echo Starting Expense Management Test Environment...
echo.

echo 1. Starting Mock API Server...
start "Mock API Server" cmd /k "node mock-server.js"

echo.
echo 2. Waiting for mock server to start...
timeout /t 3 /nobreak > nul

echo.
echo 3. Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 4. Opening test page...
timeout /t 5 /nobreak > nul
start test_companies.html

echo.
echo 5. Opening main application...
timeout /t 2 /nobreak > nul
start http://localhost:5173

echo.
echo Test environment started!
echo.
echo Services:
echo - Frontend: http://localhost:5173
echo - Mock API: http://localhost:8001
echo - Test Page: test_companies.html
echo.
echo The companies should now be visible in the login dropdown.
echo.
pause
