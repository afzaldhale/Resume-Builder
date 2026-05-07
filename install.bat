@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

set "BACKEND_DIR=%ROOT%\backend"
set "FRONTEND_DIR=%ROOT%\frontend"
set "BUILD_DIR=%ROOT%\build"
set "LOG_DIR=%BACKEND_DIR%\logs"
set "PM2_HOME=%ROOT%\.pm2"
set "TASK_NAME=ResumeBuilderPM2"

echo [1/10] Preparing environment files...
if not exist "%ROOT%\.env" (
  if exist "%BACKEND_DIR%\.env" (
    copy /Y "%BACKEND_DIR%\.env" "%ROOT%\.env" >nul
    echo Created root .env from backend\.env
  ) else (
    copy /Y "%ROOT%\.env.example" "%ROOT%\.env" >nul
    echo Root .env was created from .env.example.
    echo Update .env with valid MySQL credentials, then rerun install.bat.
    exit /b 1
  )
)

call :load_env "%ROOT%\.env"
if errorlevel 1 exit /b 1

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%PM2_HOME%" mkdir "%PM2_HOME%"

echo [2/10] Installing backend dependencies...
call npm install --prefix "%BACKEND_DIR%"
if errorlevel 1 exit /b 1

echo [3/10] Installing frontend dependencies...
call npm install --prefix "%FRONTEND_DIR%"
if errorlevel 1 exit /b 1

echo [4/10] Building React frontend...
call npm run build --prefix "%FRONTEND_DIR%"
if errorlevel 1 exit /b 1

echo [5/10] Copying frontend build to root\build...
if exist "%BUILD_DIR%" rmdir /S /Q "%BUILD_DIR%"
mkdir "%BUILD_DIR%"
robocopy "%FRONTEND_DIR%\dist" "%BUILD_DIR%" /MIR /NFL /NDL /NJH /NJS /NC /NS >nul
set "ROBOCOPY_EXIT=%ERRORLEVEL%"
if %ROBOCOPY_EXIT% GEQ 8 (
  echo Failed to copy frontend build. Robocopy exit code: %ROBOCOPY_EXIT%
  exit /b 1
)

echo [6/10] Ensuring PM2 is installed globally...
where pm2.cmd >nul 2>&1
if errorlevel 1 (
  call npm install -g pm2
  if errorlevel 1 exit /b 1
)

for /f "delims=" %%I in ('where pm2.cmd') do if not defined PM2_CMD set "PM2_CMD=%%I"
for /f "delims=" %%I in ('where node.exe') do if not defined NODE_EXE set "NODE_EXE=%%I"

if not defined PM2_CMD (
  echo Could not locate pm2.cmd after installation.
  exit /b 1
)

if not defined NODE_EXE (
  echo Could not locate node.exe on PATH.
  exit /b 1
)

for %%I in ("%PM2_CMD%") do set "PM2_BIN_DIR=%%~dpI"
for %%I in ("%NODE_EXE%") do set "NODE_BIN_DIR=%%~dpI"

echo [7/10] Applying MySQL schema...
call node "%ROOT%\backend\scripts\run-schema.js"
if errorlevel 1 exit /b 1

echo [8/10] Starting application with PM2...
call "%PM2_CMD%" delete resume-builder >nul 2>&1
call "%PM2_CMD%" start "%ROOT%\ecosystem.config.js" --env production
if errorlevel 1 exit /b 1

echo [9/10] Saving PM2 process list and enabling startup...
call "%PM2_CMD%" save --force
if errorlevel 1 exit /b 1

call :configure_startup
if errorlevel 1 (
  echo Warning: startup task creation failed. The app is still installed and running.
)

echo [10/10] Opening application in your browser...
start "" http://localhost:5000

echo Installation complete.
echo App URL: http://localhost:5000
echo PM2 logs: %LOG_DIR%
exit /b 0

:configure_startup
set "TASK_COMMAND=set PM2_HOME=%PM2_HOME%^&^& set PATH=%NODE_BIN_DIR%;%PM2_BIN_DIR%;%PATH%^&^& cd /d %ROOT%^&^& \"%PM2_CMD%\" resurrect"
schtasks /Create /TN "%TASK_NAME%" /SC ONSTART /RU SYSTEM /RL HIGHEST /TR "\"%ComSpec%\" /c %TASK_COMMAND%" /F >nul 2>&1
if errorlevel 1 (
  schtasks /Create /TN "%TASK_NAME%" /SC ONLOGON /RL HIGHEST /TR "\"%ComSpec%\" /c %TASK_COMMAND%" /F >nul 2>&1
  if errorlevel 1 exit /b 1
)
exit /b 0

:load_env
if not exist "%~1" (
  echo Missing environment file: %~1
  exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in ("%~1") do (
  set "KEY=%%A"
  set "VALUE=%%B"
  if defined KEY (
    if not "!KEY:~0,1!"=="#" (
      set "!KEY!=!VALUE!"
    )
  )
)
exit /b 0
