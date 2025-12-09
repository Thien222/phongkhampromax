@echo off
title Eye Clinic Management Server
color 0A
cls
echo ==================================================
echo      EYE CLINIC MANAGEMENT PRO - SERVER
echo ==================================================
echo.
echo [INFO] Starting Database and Web Server...
echo [INFO] Please do not close this window while using.
echo.

start http://localhost:3001

"%~dp0bin\node.exe" "%~dp0server.js"

pause
