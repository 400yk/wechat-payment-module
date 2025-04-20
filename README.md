# WeChat Personal Payment QR Code Module
# 微信个人收款码支付模块

A Node.js module for handling payments through WeChat personal payment QR codes (微信个人收款码).  
一个用于处理微信个人收款码支付的Node.js模块。

## Features | 功能特点

- Generate payment orders with dynamically calculated payment amounts | 生成动态计算金额的支付订单
- Verify payments by parsing WeChat payment notification messages | 通过解析微信支付通知消息验证支付
- Handle concurrent payment requests | 处理并发支付请求
- Prevent payment collisions by assigning unique payment amounts | 通过分配唯一支付金额防止支付冲突
- Support for multiple membership/product types | 支持多种会员/产品类型

## How It Works | 工作原理

This module uses a clever approach to verify payments through WeChat personal QR codes:  
该模块使用巧妙的方法通过微信个人收款码验证支付：

1. A user initiates a payment request for a specific product/membership | 用户为特定产品/会员发起支付请求
2. The system generates a unique payment amount (e.g., ¥39.97 instead of ¥40.00) | 系统生成唯一的支付金额（例如¥39.97而不是¥40.00）
3. The user scans the WeChat QR code and pays the exact amount | 用户扫描微信二维码并支付准确金额
4. WeChat sends a payment notification message | 微信发送支付通知消息
5. The system parses the notification message and extracts the payment amount | 系统解析通知消息并提取支付金额
6. The system matches the amount with pending orders and updates the payment status | 系统匹配金额与待处理订单并更新支付状态

## Prerequisites | 前提条件

- Node.js (v14+)
- MySQL (v5.7+)
- WeChat personal payment QR code image (renamed to `skm.png`) | 微信个人收款码图片（重命名为`skm.png`）
- Success image for successful payments (renamed to `success.png`) | 支付成功图片（重命名为`success.png`）

## Installation | 安装

1. Clone the repository | 克隆仓库:
   ```
   git clone https://github.com/yourusername/wechat-payment-module.git
   cd wechat-payment-module
   ```

2. Install dependencies | 安装依赖:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` | 基于`.env.example`创建`.env`文件:
   ```
   cp .env.example .env
   ```

4. Add your QR code images | 添加您的二维码图片:
   - Place your WeChat payment QR code as `imgs/skm.png` | 将您的微信支付二维码放在`imgs/skm.png`
   - Place your success image as `imgs/success.png` | 将成功图片放在`imgs/success.png`

5. Set up the database | 设置数据库:
   ```
   mysql -u your_username -p < init_db.sql
   ```

## Usage | 使用方法

1. Start the server | 启动服务器:
   ```
   npm start
   ```

2. API Endpoints | API端点:
   - `POST /order` - Create a new payment order | 创建新的支付订单
   - `GET /order/checkPay` - Check payment status | 检查支付状态
   - `GET /payNotify` - Endpoint for payment notification | 支付通知端点

### Creating a Payment Order | 创建支付订单

```javascript
// Client-side example | 客户端示例
const response = await fetch('/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    orderNum: 'ORDER123',
    orderPrice: 39 // Price in yuan | 价格（人民币元）
  })
});

const data = await response.json();
// data.needPayFromServer contains the exact amount to pay | data.needPayFromServer包含需支付的确切金额
// data.QRPayImage contains the base64 encoded QR code image | data.QRPayImage包含base64编码的二维码图片
```

### Checking Payment Status | 检查支付状态

```javascript
// Client-side example | 客户端示例
const checkPayment = async () => {
  const response = await fetch(`/order/checkPay?orderNum=ORDER123&needPay=39`);
  const data = await response.json();
  
  if (data.message === '支付成功') {
    // Payment successful | 支付成功
  } else {
    // Payment pending | 支付待处理
    setTimeout(checkPayment, 3000); // Check again in 3 seconds | 3秒后再次检查
  }
};
```

### Processing Payment Notification | 处理支付通知

For WeChat personal payment codes, you need to configure a way to get the payment notifications. This could be through:  
对于微信个人收款码，您需要配置获取支付通知的方式。可以通过：

1. Manual input of the notification text | 手动输入通知文本
2. Using WeChat's notification forwarding to email | 使用微信通知转发到邮箱
3. OCR reading of the notification | OCR读取通知

The notification is then sent to the `/payNotify` endpoint:  
然后将通知发送到`/payNotify`端点：

```
GET /payNotify?orderMsg=微信支付收款39.97元
```

## Integration with Your Application | 与您的应用程序集成

This module can be integrated with your existing Node.js application:  
该模块可以与您现有的Node.js应用程序集成：

1. Copy the relevant directories: `controllers`, `routes/api`, `config`, `imgs` | 复制相关目录：`controllers`、`routes/api`、`config`、`imgs`
2. Add the routes to your Express application | 将路由添加到您的Express应用程序:
   ```javascript
   app.use('/payNotify', require('./routes/api/payNotify'));
   app.use('/order', require('./routes/api/order'));
   ```
3. Ensure your authentication middleware sets `req.user` | 确保您的认证中间件设置`req.user`

## Customization | 自定义

- Modify `config/memberOfferings.js` to adjust your product/membership offerings | 修改`config/memberOfferings.js`以调整您的产品/会员供应
- Customize the SQL queries in the controllers to fit your database structure | 自定义控制器中的SQL查询以适应您的数据库结构
- Adjust timeout values and concurrent payment limits in the controllers | 在控制器中调整超时值和并发支付限制

## Security Considerations | 安全考虑

This module is designed for personal use and small businesses. It does not include:  
此模块设计用于个人使用和小型企业。它不包括：

- Strong payment verification (relies on matching payment amounts) | 强大的支付验证（依赖匹配支付金额）
- Payment gateway security measures | 支付网关安全措施
- Compliance with financial regulations | 符合金融法规

Use at your own risk for commercial applications.  
对于商业应用，请自行承担风险。

## License | 许可证

MIT 