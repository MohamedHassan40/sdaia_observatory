# PowerShell script to create .env file for scrapers
Write-Host "Creating .env file for scrapers..." -ForegroundColor Green

# Create .env file for scrapers
$envContent = @"
# Backend URL for scrapers
BACKEND_URL=http://34.132.72.150:8000/
"@

# Write to .env in root directory
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "Created .env file with backend URL for scrapers" -ForegroundColor Green
Write-Host "BACKEND_URL=http://34.132.72.150:8000/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now you can run the scrapers to save data to the backend." -ForegroundColor Cyan 