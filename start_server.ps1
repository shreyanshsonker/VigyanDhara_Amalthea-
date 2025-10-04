Write-Host "Starting Expense Management System..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Loading test data..." -ForegroundColor Yellow
Set-Location backend

try {
    python manage.py load_test_data
    if ($LASTEXITCODE -ne 0) {
        throw "Error loading test data"
    }
    Write-Host "Test data loaded successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error loading test data: $_" -ForegroundColor Red
    Write-Host "Make sure Python and Django are installed." -ForegroundColor Red
    Read-Host "Press Enter to continue anyway"
}

Write-Host ""
Write-Host "2. Starting Django server..." -ForegroundColor Yellow

try {
    python manage.py runserver
}
catch {
    Write-Host "Error starting Django server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
