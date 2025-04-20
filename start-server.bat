@echo off
echo Starting WeChat Payment Server / 启动微信支付服务器
echo ============================================

REM Setup Node.js path
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

REM Change to current directory
cd /d "%~dp0"

echo Starting server... / 正在启动服务器...
REM Run node directly
"%NODE_PATH%\node.exe" ./bin/www

REM If an error occurs, pause to view
if %errorlevel% neq 0 (
  echo Server failed to start! / 服务器启动失败！
  pause
) 