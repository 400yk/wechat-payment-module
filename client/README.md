# 微信支付模块客户端组件
# WeChat Payment Module Client Components

这个目录包含了微信支付模块的客户端React组件。  
This directory contains the client-side React components for the WeChat Payment Module.

## 功能 | Features

- 微信支付对话框组件 | WeChat payment dialog component
- 支持中英文双语界面 | Supports bilingual interface (Chinese and English)
- 响应式设计，适配移动设备 | Responsive design for mobile devices
- 动态二维码显示 | Dynamic QR code display
- 支付状态自动检查 | Automatic payment status checking
- 支付超时处理 | Payment timeout handling

## 使用方法 | Usage

### 安装 | Installation

```bash
# 如果您正在开发一个新项目 | If you're developing a new project
npm install --save wechat-payment-module-client

# 或者直接复制这个目录到您的项目中 | Or copy this directory into your project
```

### 在React应用中使用 | Using in a React application

```jsx
import React, { useState } from 'react';
import { PaymentDialog } from 'wechat-payment-module-client';
// 如果您直接复制了目录 | If you copied the directory directly
// import { PaymentDialog } from './path/to/wechat-payment-module/client';

function MyApp() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  
  const handlePaymentSuccess = (expirationDate) => {
    console.log('Payment successful, expiration date:', expirationDate);
    // 处理支付成功逻辑 | Handle successful payment logic
  };
  
  const startPayment = (amount) => {
    setPaymentAmount(amount);
    setIsPaymentOpen(true);
  };
  
  return (
    <div>
      <button onClick={() => startPayment(39)}>购买月度会员 | Buy Monthly Subscription</button>
      
      {/* 支付对话框组件 | Payment Dialog Component */}
      <PaymentDialog
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentAmount}
        apiBaseUrl="/api" // 调整为您的API端点 | Adjust to your API endpoint
        onSuccess={handlePaymentSuccess}
        lang="zh" // 'zh' 为中文，'en' 为英文 | 'zh' for Chinese, 'en' for English
      />
    </div>
  );
}
```

## 组件属性 | Component Props

`PaymentDialog` 组件接受以下属性：  
The `PaymentDialog` component accepts the following props:

| 属性 Prop | 类型 Type | 默认值 Default | 描述 Description |
|-----------|-----------|----------------|------------------|
| `open` | boolean | | 控制对话框是否显示 \| Controls dialog visibility |
| `onClose` | function | | 关闭对话框时的回调函数 \| Callback when dialog closes |
| `amount` | number | | 支付金额 \| Payment amount |
| `apiBaseUrl` | string | `''` | API端点的基础URL \| Base URL for API calls |
| `onSuccess` | function | `() => {}` | 支付成功时的回调函数 \| Callback when payment is successful |
| `lang` | string | `'zh'` | 语言选择 ('zh'为中文, 'en'为英文) \| Language selection ('zh' for Chinese, 'en' for English) |

## 开发 | Development

```bash
# 安装依赖 | Install dependencies
npm install

# 启动开发服务器 | Start development server
npm start

# 构建生产版本 | Build production version
npm run build
```

## 服务器端集成 | Server-side Integration

此客户端组件需要与服务器端API配合使用。请确保您的服务器实现了以下端点：  
This client component needs to be used with a server-side API. Make sure your server implements the following endpoints:

- `POST /order` - 创建支付订单 | Create payment order
- `GET /order/checkPay` - 检查支付状态 | Check payment status 