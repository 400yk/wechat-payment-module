-- Create database
CREATE DATABASE IF NOT EXISTS paymentdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paymentdb;

-- Create user table (simplified for the payment module)
CREATE TABLE IF NOT EXISTS `userInfo` (
  `userId` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE
);

-- Create order table
CREATE TABLE IF NOT EXISTS `orderList` (
  `orderId` int PRIMARY KEY AUTO_INCREMENT COMMENT 'id',
  `userId` int DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `order_num` varchar(32) DEFAULT NULL COMMENT '订单号',
  `order_time` varchar(32) DEFAULT NULL COMMENT '创建时间',
  `order_price` float DEFAULT NULL COMMENT '订单价格（真实价格）',
  `order_money` float DEFAULT NULL COMMENT '订单价格（支付金额）',
  `order_paytime` varchar(32) DEFAULT NULL COMMENT '支付时间',
  `order_status` int(2) NOT NULL DEFAULT '1' COMMENT '支付状态（1未支付 2已支付）',
  `order_msg` text COMMENT '微信支付原文',
  CONSTRAINT `fk_order_username` FOREIGN KEY (`username`) REFERENCES `userInfo`(`username`) ON DELETE CASCADE
);

-- Create test user
INSERT INTO `userInfo` (`username`) VALUES ('testuser'); 