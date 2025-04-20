import React, { useState } from 'react';
import PaymentDialog from './components/PaymentDialog';
import './App.css';

/**
 * 示例应用：展示如何使用微信支付组件
 * Example Application: Demonstrates how to use the WeChat Payment component
 */
function App() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [currentExpiration, setCurrentExpiration] = useState('');
  const [language, setLanguage] = useState('zh'); // 'zh' for Chinese, 'en' for English
  
  // 模拟产品/会员类型
  // Simulated product/membership types
  const products = [
    { id: 1, name: language === 'zh' ? '月度会员' : 'Monthly Membership', price: 39 },
    { id: 2, name: language === 'zh' ? '季度会员' : 'Quarterly Membership', price: 99 },
    { id: 3, name: language === 'zh' ? '年度会员' : 'Annual Membership', price: 299 }
  ];
  
  const handlePaymentSuccess = (expirationDate) => {
    console.log('Payment successful, new expiration date:', expirationDate);
    setCurrentExpiration(expirationDate);
  };
  
  const startPayment = (amount) => {
    setSelectedAmount(amount);
    setIsPaymentOpen(true);
  };
  
  // 切换语言
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'zh' ? 'en' : 'zh');
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{language === 'zh' ? '微信支付示例' : 'WeChat Payment Example'}</h1>
        <button onClick={toggleLanguage} className="language-toggle">
          {language === 'zh' ? 'English' : '中文'}
        </button>
      </header>
      
      <main className="app-content">
        {currentExpiration && (
          <div className="expiration-notice">
            {language === 'zh' 
              ? `当前会员有效期至: ${currentExpiration}` 
              : `Current membership valid until: ${currentExpiration}`
            }
          </div>
        )}
        
        <div className="products-container">
          <h2>{language === 'zh' ? '选择会员类型' : 'Choose Membership Type'}</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="product-price">¥{product.price}</p>
                <button 
                  className="payment-button"
                  onClick={() => startPayment(product.price)}
                >
                  {language === 'zh' ? '立即购买' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <PaymentDialog
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={selectedAmount}
        apiBaseUrl="/api" // Adjust this based on your API endpoint
        onSuccess={handlePaymentSuccess}
        lang={language}
      />
      
      <footer className="app-footer">
        <p>
          {language === 'zh' 
            ? '微信支付模块示例 © 2023' 
            : 'WeChat Payment Module Example © 2023'
          }
        </p>
      </footer>
    </div>
  );
}

export default App; 