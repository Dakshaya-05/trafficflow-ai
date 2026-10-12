@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for TrafficFlow AI Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "DIR=%~dp0"
set "ROOT_MAVEN=%DIR%..\..\apache-maven-3.9.6\bin\mvn.cmd"
set "LOCAL_MAVEN=%DIR%apache-maven-3.9.6\bin\mvn.cmd"

if exist "%ROOT_MAVEN%" (
    call "%ROOT_MAVEN%" %*
    exit /b %ERRORLEVEL%
)

if exist "%LOCAL_MAVEN%" (
    call "%LOCAL_MAVEN%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Maven or check apache-maven-3.9.6 directory.
exit /b 1
