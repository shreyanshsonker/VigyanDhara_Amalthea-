Write-Host "Starting Expense Management System with Mock Server..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Installing mock server dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules\express")) {
    npm install express cors --save
}

Write-Host ""
Write-Host "2. Starting mock API server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "mock-server.js" -WindowStyle Normal

Write-Host ""
Write-Host "3. Waiting for mock server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "4. Starting frontend development server..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

Write-Host ""
Write-Host "5. Opening application in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "System started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Available services:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Mock API: http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor Cyan
Write-Host "TechCorp Solutions:" -ForegroundColor Yellow
Write-Host "  Admin: admin@techcorp.com / admin123" -ForegroundColor White
Write-Host "  Manager: manager@techcorp.com / admin123" -ForegroundColor White
Write-Host "  Employee: employee1@techcorp.com / admin123" -ForegroundColor White
Write-Host ""
Write-Host "FinanceFirst Inc:" -ForegroundColor Yellow
Write-Host "  Admin: admin@financefirst.com / admin123" -ForegroundColor White
Write-Host "  Manager: manager@financefirst.com / admin123" -ForegroundColor White
Write-Host "  Employee: employee1@financefirst.com / admin123" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
