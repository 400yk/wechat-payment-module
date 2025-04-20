# WeChat Personal Payment QR Code Module

A Node.js module for handling payments through WeChat personal payment QR codes (微信个人收款码).

## Features

- Generate payment orders with dynamically calculated payment amounts
- Verify payments by parsing WeChat payment notification messages
- Handle concurrent payment requests
- Prevent payment collisions by assigning unique payment amounts
- Support for multiple membership/product types

## How It Works

This module uses a clever approach to verify payments through WeChat personal QR codes:

1. A user initiates a payment request for a specific product/membership
2. The system generates a unique payment amount (e.g., ¥39.97 instead of ¥40.00)
3. The user scans the WeChat QR code and pays the exact amount
4. WeChat sends a payment notification message
5. The system parses the notification message and extracts the payment amount
6. The system matches the amount with pending orders and updates the payment status

## Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- WeChat personal payment QR code image (renamed to `skm.png`)
- Success image for successful payments (renamed to `success.png`)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wechat-payment-module.git
   cd wechat-payment-module
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```

4. Add your QR code images:
   - Place your WeChat payment QR code as `imgs/skm.png`
   - Place your success image as `imgs/success.png`

5. Set up the database:
   ```
   mysql -u your_username -p < init_db.sql
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. API Endpoints:
   - `POST /order` - Create a new payment order
   - `GET /order/checkPay` - Check payment status
   - `GET /payNotify` - Endpoint for payment notification

### Creating a Payment Order

```javascript
// Client-side example
const response = await fetch('/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    orderNum: 'ORDER123',
    orderPrice: 39 // Price in yuan
  })
});

const data = await response.json();
// data.needPayFromServer contains the exact amount to pay
// data.QRPayImage contains the base64 encoded QR code image
```

### Checking Payment Status

```javascript
// Client-side example
const checkPayment = async () => {
  const response = await fetch(`/order/checkPay?orderNum=ORDER123&needPay=39`);
  const data = await response.json();
  
  if (data.message === '支付成功') {
    // Payment successful
  } else {
    // Payment pending
    setTimeout(checkPayment, 3000); // Check again in 3 seconds
  }
};
```

### Processing Payment Notification

For WeChat personal payment codes, you need to configure a way to get the payment notifications. This could be through:

1. Manual input of the notification text
2. Using WeChat's notification forwarding to email
3. OCR reading of the notification

The notification is then sent to the `/payNotify` endpoint:

```
GET /payNotify?orderMsg=微信支付收款39.97元
```

## Integration with Your Application

This module can be integrated with your existing Node.js application:

1. Copy the relevant directories: `controllers`, `routes/api`, `config`, `imgs`
2. Add the routes to your Express application:
   ```javascript
   app.use('/payNotify', require('./routes/api/payNotify'));
   app.use('/order', require('./routes/api/order'));
   ```
3. Ensure your authentication middleware sets `req.user`

## Customization

- Modify `config/memberOfferings.js` to adjust your product/membership offerings
- Customize the SQL queries in the controllers to fit your database structure
- Adjust timeout values and concurrent payment limits in the controllers

## Security Considerations

This module is designed for personal use and small businesses. It does not include:

- Strong payment verification (relies on matching payment amounts)
- Payment gateway security measures
- Compliance with financial regulations

Use at your own risk for commercial applications.

## License

MIT 