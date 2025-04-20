import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Import styles for dialog
import './PaymentDialog.css';

// Import default images
import expireImg from '../assets/expire.png';
import warningImg from '../assets/warning.png';

/**
 * 微信支付弹窗组件
 * WeChat Payment Dialog Component 
 * 
 * @param {Object} props Component props
 * @param {boolean} props.open Controls dialog visibility
 * @param {Function} props.onClose Callback when dialog closes
 * @param {number} props.amount Payment amount
 * @param {string} props.apiBaseUrl Base URL for API calls (default: '')
 * @param {Function} props.onSuccess Callback when payment is successful (receives expiration date)
 */
const PaymentDialog = ({ 
  open, 
  onClose, 
  amount, 
  apiBaseUrl = '', 
  onSuccess = () => {},
  lang = 'zh' // 'zh' for Chinese, 'en' for English
}) => {
  const [orderExpireTime, setOrderExpireTime] = useState(120); // 订单过期时间（单位：秒）/ Order expiration time (in seconds)
  const [orderNum, setOrderNum] = useState('');
  const [qrPayImg, setQrPayImg] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [actualAmount, setActualAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const errorRef = useRef();

  // 格式化时间 / Format time
  const formatTime = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  // 生成订单号 / Generate order number
  const generateOrderNum = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = formatTime(currentDate.getMonth() + 1);
    const day = formatTime(currentDate.getDate());
    const hours = formatTime(currentDate.getHours());
    const minutes = formatTime(currentDate.getMinutes());
    const seconds = formatTime(currentDate.getSeconds());

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  let timer = null;

  useEffect(() => {
    if (open && amount > 0) {
      setErrorMsg("");
      
      // 检查支付状态 / Check payment status
      const checkPayment = async (orderNumberToCheck) => {
        try {
          const response = await axios.get(`${apiBaseUrl}/order/checkPay?orderNum=${orderNumberToCheck}&needPay=${amount}`);

          if (response.status === 200) {
            // 支付成功 / Payment successful
            const { message, QRPayImage, newExpiration } = response.data;
            setQrPayImg(QRPayImage);
            if (newExpiration) {
              setExpirationDate(newExpiration.slice(0, 10));
            }
            clearInterval(timer);
            timer = null;
            setPaySuccess(true);
            onSuccess(newExpiration);
            console.log(message);
          } else {
            const { message } = response.data;
            console.log(message);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      // 开始倒计时 / Start countdown
      const startCountdown = (orderNumberToCheck) => {
        const timeCountDown = 120;
        let remainingTime = timeCountDown;
        timer = setInterval(() => {
          remainingTime = remainingTime - 1;
          setOrderExpireTime(remainingTime);
          if (remainingTime <= 0) {
            setQrPayImg(expireImg);
            clearInterval(timer);
            timer = null;
            setOrderExpireTime(120);
          } else if (remainingTime % 2 === 0) { 
            // 每两秒检查一次支付状态 / Check payment status every 2 seconds
            checkPayment(orderNumberToCheck);
          }
        }, 1000);
      };

      // 创建订单 / Create order
      const createOrder = async () => {
        const generatedOrderNum = generateOrderNum();
        setOrderNum(generatedOrderNum);
        
        try {
          const response = await axios.post(`${apiBaseUrl}/order`, {
            "orderNum": generatedOrderNum,
            "orderPrice": amount
          });

          if (response.status === 200) {
            const { needPayFromServer, QRPayImage } = response.data;
            setActualAmount(needPayFromServer);
            setQrPayImg(QRPayImage);
            startCountdown(generatedOrderNum);
          } else {
            setQrPayImg(warningImg);
            setErrorMsg(lang === 'zh' ? "订单创建失败！" : "Failed to create order!");
            if (errorRef.current) errorRef.current.focus();
          }
        } catch (err) {
          setQrPayImg(warningImg);
          err?.response?.data?.message 
            ? setErrorMsg(err.response.data.message) 
            : setErrorMsg(lang === 'zh' ? "订单创建失败！" : "Failed to create order!");
          if (errorRef.current) errorRef.current.focus();
          console.error(err);
        }
      };

      createOrder();

      return () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        setErrorMsg("");
      };
    }
  }, [open, amount, apiBaseUrl]);

  // 关闭弹窗时清理 / Cleanup when dialog closes
  useEffect(() => {
    if (!open && timer) {
      clearInterval(timer);
      setOrderExpireTime(0);
      timer = null;
      setErrorMsg("");
    }
  }, [open]);

  if (!open) return null;

  const texts = {
    title: lang === 'zh' ? '微信支付' : 'WeChat Payment',
    paymentAmount: lang === 'zh' ? '支付金额' : 'Payment Amount',
    scanCode: lang === 'zh' ? '请识别上方收款码输入' : 'Please scan the QR code and pay',
    exactAmount: lang === 'zh' ? '输入的金额必须要完全一致' : 'The amount must match exactly',
    countdown: lang === 'zh' ? '倒计时' : 'Countdown',
    congrats: lang === 'zh' ? '恭喜！您的支付已成功' : 'Congratulations! Your payment was successful',
    validUntil: lang === 'zh' ? '当前有效期至' : 'Valid until',
    close: lang === 'zh' ? '关闭' : 'Close'
  };

  return (
    <div className="wechat-payment-dialog-overlay">
      <div className="wechat-payment-dialog">
        <div className="wechat-payment-dialog-header">
          <h2>{texts.title}</h2>
          <button className="wechat-payment-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="wechat-payment-dialog-content">
          <p className="wechat-payment-amount">
            {texts.paymentAmount}: ¥{actualAmount}
          </p>

          {qrPayImg && (
            <div className="wechat-payment-qr-container">
              <img 
                src={qrPayImg} 
                alt="Payment QR Code" 
                className="wechat-payment-qrcode" 
              />
            </div>
          )}
          
          {errorMsg && (
            <p 
              ref={errorRef} 
              className="wechat-payment-error"
            >
              {errorMsg}
            </p>
          )}

          {paySuccess ? (
            <div className="wechat-payment-success">
              <p>{texts.congrats}</p>
              {expirationDate && (
                <p>{texts.validUntil}: {expirationDate}</p>
              )}
            </div>
          ) : (
            <div className="wechat-payment-instructions">
              <p>
                {texts.scanCode} {actualAmount}元
              </p>
              <p>
                {texts.exactAmount}
              </p>
              <p className="wechat-payment-countdown">
                {texts.countdown}: {formatTime(parseInt(orderExpireTime / 60))}:{formatTime(orderExpireTime % 60)}
              </p>
            </div>
          )}
          
          <div style={{ display: 'none' }}>
            <p id="orderNum">{orderNum}</p>
            <p id="needPay">{actualAmount}</p>
          </div>
        </div>
        
        <div className="wechat-payment-dialog-actions">
          <button 
            className="wechat-payment-button"
            onClick={() => {
              onClose();
              setPaySuccess(false);
            }}
          >
            {texts.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog; 