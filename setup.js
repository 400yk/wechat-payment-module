#!/usr/bin/env node

/**
 * 微信支付模块安装脚本
 * WeChat Payment Module Setup Script
 * 
 * 此脚本帮助用户设置和配置微信支付模块
 * This script helps users set up and configure the WeChat Payment Module
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Use full paths to executables
const npmCmd = 'C:\\Program Files\\nodejs\\npm.cmd';
const nodeCmd = 'C:\\Program Files\\nodejs\\node.exe';

console.log('\n🚀 微信支付模块安装助手 | WeChat Payment Module Setup Assistant\n');

// Install dependencies
console.log('📦 正在安装依赖项 | Installing dependencies...\n');

try {
  execSync(`"${npmCmd}" install`, { stdio: 'inherit' });
  console.log('\n✅ 服务器端依赖安装成功 | Server-side dependencies installed successfully');
} catch (error) {
  console.error('\n❌ 服务器端依赖安装失败 | Server-side dependencies installation failed');
  console.error(error.message);
  process.exit(1);
}

// Check if images directory exists, create if not
const imgsDir = path.join(__dirname, 'imgs');
if (!fs.existsSync(imgsDir)) {
  fs.mkdirSync(imgsDir, { recursive: true });
  console.log('\n📁 创建图片目录 | Created images directory');
}

// Check for .env file, create if not exists
const envFile = path.join(__dirname, '.env');
const envExampleFile = path.join(__dirname, '.env.example');

if (!fs.existsSync(envFile) && fs.existsSync(envExampleFile)) {
  fs.copyFileSync(envExampleFile, envFile);
  console.log('\n📄 从示例创建.env文件 | Created .env file from example');
}

// Setup client side if requested
rl.question('\n🔄 是否安装客户端依赖? (y/n) | Install client-side dependencies? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n📦 正在安装客户端依赖项 | Installing client-side dependencies...\n');
    
    try {
      // Go to client directory and install dependencies manually
      const clientDir = path.join(__dirname, 'client');
      process.chdir(clientDir);
      
      // Use --ignore-scripts to skip problematic postinstall scripts
      execSync(`"${npmCmd}" install --ignore-scripts`, { 
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: `C:\\Program Files\\nodejs;${process.env.PATH}`
        }
      });
      
      process.chdir(__dirname);
      console.log('\n✅ 客户端依赖安装成功 | Client-side dependencies installed successfully');
    } catch (error) {
      console.error('\n❌ 客户端依赖安装失败 | Client-side dependencies installation failed');
      console.error(error.message);
    }
  }

  console.log('\n🎉 安装完成! | Installation complete!');
  console.log('\n📝 接下来 | Next steps:');
  console.log('   1. 添加您的微信支付二维码到 imgs/skm.png | Add your WeChat QR code to imgs/skm.png');
  console.log('   2. 添加成功图片到 imgs/success.png | Add success image to imgs/success.png'); 
  console.log('   3. 添加超时图片到 imgs/expire.png | Add timeout image to imgs/expire.png');
  console.log('   4. 配置 .env 文件 | Configure your .env file');
  console.log('   5. 运行 npm start 启动服务器 | Run npm start to start the server\n');

  rl.close();
}); 