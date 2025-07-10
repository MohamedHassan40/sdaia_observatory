# PowerShell script to update environment configuration for local development
Write-Host "Updating environment configuration for local development..." -ForegroundColor Green

# Create .env.local file for local development
$envContent = @"
# Local development environment variables
BACKEND_URL=http://localhost:8000/
NEXT_PUBLIC_API_URL=http://localhost:3000/
"@

# Write to .env.local in frontend directory
$envContent | Out-File -FilePath "frontend\.env.local" -Encoding UTF8

Write-Host "Created frontend\.env.local with local development settings" -ForegroundColor Green
Write-Host "BACKEND_URL=http://localhost:8000/" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_API_URL=http://localhost:3000/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please restart your frontend development server for changes to take effect." -ForegroundColor Cyan 