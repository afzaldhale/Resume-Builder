@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "PM2_HOME=%ROOT%\.pm2"

where pm2.cmd >nul 2>&1
if errorlevel 1 (
  echo PM2 is not installed. Run install.bat first.
  exit /b 1
)

for /f "delims=" %%I in ('where pm2.cmd') do if not defined PM2_CMD set "PM2_CMD=%%I"

call "%PM2_CMD%" describe resume-builder >nul 2>&1
if errorlevel 1 (
  call "%PM2_CMD%" start "%ROOT%\ecosystem.config.js" --env production
) else (
  call "%PM2_CMD%" restart resume-builder --update-env
)

if errorlevel 1 exit /b 1

call "%PM2_CMD%" save --force
start "" http://localhost:5000
exit /b 0
