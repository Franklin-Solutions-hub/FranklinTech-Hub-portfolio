@echo off
title FranklinTech Hub - Local Server
echo ============================================
echo    FranklinTech Hub - Local Server
echo ============================================
echo.
echo Starting local server on http://localhost:8000
echo.
echo  Website:  http://localhost:8000/franklin_portfolio.html
echo  Admin:    http://localhost:8000/admin/index.html
echo.
echo Press Ctrl+C to stop the server.
echo ============================================
echo.
cd /d "%~dp0"
python -m http.server 8000
