@echo off
title FranklinTech Hub - Local Server
echo ============================================
echo    FranklinTech Hub - Local Server
echo ============================================
echo.
echo Starting local Node.js server on http://localhost:3000
echo.
echo  Website:  http://localhost:3000/franklin_portfolio.html
echo  Admin:    http://localhost:3000/admin/index.html
echo.
echo Press Ctrl+C to stop the server.
echo ============================================
echo.
cd /d "%~dp0"
node server.js
