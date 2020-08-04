SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_banners
-- ----------------------------
DROP TABLE IF EXISTS `article_banners`;
CREATE TABLE `article_banners`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '疫情小知识轮播图ID',
  `weight` int(11) NOT NULL COMMENT '轮播图权重，大的出现在先',
  `aid` int(11) NOT NULL COMMENT '轮播图对应文章ID',
  `category` int(11) NOT NULL COMMENT '文章类别',
  `url` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '轮播图图片URL',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for article_comment_likes
-- ----------------------------
DROP TABLE IF EXISTS `article_comment_likes`;
CREATE TABLE `article_comment_likes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章评论点赞记录ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `cid` int(11) NOT NULL COMMENT '评论ID',
  `liked` tinyint(1) NOT NULL COMMENT '评论点赞状态',
  `aid` int(11) NOT NULL COMMENT '文章ID',
  `category` int(11) NOT NULL COMMENT '文章类别',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for article_comments
-- ----------------------------
DROP TABLE IF EXISTS `article_comments`;
CREATE TABLE `article_comments`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '文章评论ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `aid` int(11) NOT NULL COMMENT '文章ID',
  `category` int(11) NOT NULL COMMENT '文章类别',
  `content` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论内容',
  `likes` int(11) NOT NULL COMMENT '点赞数',
  `version` int(11) NULL DEFAULT 0 COMMENT '乐观锁计数',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for article_fav
-- ----------------------------
DROP TABLE IF EXISTS `article_fav`;
CREATE TABLE `article_fav`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收藏记录ID',
  `uid` int(11) NOT NULL COMMENT '操作用户ID',
  `aid` int(11) NOT NULL COMMENT '被收藏的文章ID',
  `category` int(11) NOT NULL COMMENT '文章所属类别',
  `favorited` tinyint(1) NOT NULL COMMENT '收藏记录状态',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for article_likes
-- ----------------------------
DROP TABLE IF EXISTS `article_likes`;
CREATE TABLE `article_likes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '点赞记录ID',
  `uid` int(11) NOT NULL COMMENT '点赞用户ID',
  `aid` int(11) NOT NULL COMMENT '被点赞文章ID',
  `category` int(11) NOT NULL COMMENT '文章所属类别',
  `liked` tinyint(1) NOT NULL COMMENT '点赞记录状态',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '文章ID',
  `uid` int(11) NOT NULL COMMENT '撰写文章的用户ID',
  `title` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章标题',
  `desc` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章概述',
  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章内容',
  `tags` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章标签，标签之间|隔开',
  `likes` int(11) NOT NULL COMMENT '文章点赞数',
  `availability` int(11) NOT NULL COMMENT '文章开放权限',
  `category` int(11) NOT NULL COMMENT '文章类别',
  `version` int(11) NULL DEFAULT 0 COMMENT '乐观锁计数',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for bathhouse_appointments
-- ----------------------------
DROP TABLE IF EXISTS `bathhouse_appointments`;
CREATE TABLE `bathhouse_appointments`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '澡堂预约订单ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `bid` int(11) NOT NULL COMMENT '澡堂ID',
  `seat` int(11) NOT NULL COMMENT '淋浴位ID',
  `beginTime` int(11) NOT NULL COMMENT '预约的开始洗浴时间',
  `endTime` int(11) NOT NULL COMMENT '预定的结束洗浴时间',
  `status` int(11) NOT NULL COMMENT '预约的订单状态',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for bathhouse_seats
-- ----------------------------
DROP TABLE IF EXISTS `bathhouse_seats`;
CREATE TABLE `bathhouse_seats`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '淋浴位ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `bid` int(11) NOT NULL COMMENT '澡堂ID',
  `code` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '淋浴位编号',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for bathhouses
-- ----------------------------
DROP TABLE IF EXISTS `bathhouses`;
CREATE TABLE `bathhouses`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '澡堂ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '澡堂名称',
  `code` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '订单代号',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteen_appointments
-- ----------------------------
DROP TABLE IF EXISTS `canteen_appointments`;
CREATE TABLE `canteen_appointments`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '预约订单ID',
  `uid` int(11) NOT NULL COMMENT '下订单的用户ID',
  `cid` int(11) NOT NULL COMMENT '食堂ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `beginTime` int(11) NOT NULL COMMENT '开始堂食时间/取餐时间/理想送达时间',
  `endTime` int(11) NULL DEFAULT NULL COMMENT '结束堂食时间',
  `type` int(11) NOT NULL COMMENT '订单类型',
  `items` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预约的菜品列表，用|隔开',
  `price` int(11) NOT NULL COMMENT '订单的总价',
  `status` int(11) NOT NULL COMMENT '当前预约订单的状态',
  `seat` int(11) NULL DEFAULT NULL COMMENT '堂食选择的餐桌座位ID',
  `table` int(11) NULL DEFAULT NULL COMMENT '堂食选择的餐桌ID',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteen_categories
-- ----------------------------
DROP TABLE IF EXISTS `canteen_categories`;
CREATE TABLE `canteen_categories`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '菜品类别ID',
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类别名称',
  `cid` int(11) NOT NULL COMMENT '食堂ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteen_items
-- ----------------------------
DROP TABLE IF EXISTS `canteen_items`;
CREATE TABLE `canteen_items`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '菜品ID',
  `name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜品名称',
  `price` int(11) NOT NULL COMMENT '菜品价格',
  `cid` int(11) NOT NULL COMMENT '食堂ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `category` int(11) NOT NULL COMMENT '菜品所属的类别ID',
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜品的展示图片URL',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteen_seats
-- ----------------------------
DROP TABLE IF EXISTS `canteen_seats`;
CREATE TABLE `canteen_seats`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '座位ID',
  `tid` int(11) NOT NULL COMMENT '桌子的ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `cid` int(11) NOT NULL COMMENT '食堂ID',
  `dir` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '椅子的朝向,U,D,L,R',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteen_tables
-- ----------------------------
DROP TABLE IF EXISTS `canteen_tables`;
CREATE TABLE `canteen_tables`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '餐桌ID',
  `code` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '餐桌代号',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `cid` int(11) NOT NULL COMMENT '食堂ID',
  `seatsNum` tinyint(4) NOT NULL DEFAULT 0 COMMENT '该餐桌的椅子数量',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for canteens
-- ----------------------------
DROP TABLE IF EXISTS `canteens`;
CREATE TABLE `canteens`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '食堂设置的主键ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '食堂名称',
  `code` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '食堂订单代号，必须为5个大写英文字符',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for healthy_signin
-- ----------------------------
DROP TABLE IF EXISTS `healthy_signin`;
CREATE TABLE `healthy_signin`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '打卡记录ID',
  `uid` int(11) NOT NULL COMMENT '学号',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `count` int(11) NOT NULL COMMENT '当天打卡次数',
  `temperature` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '温度，用|隔开',
  `location` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '打卡位置，格式x,y，x表示纬度,y表示经度。用|隔开每次打卡记录的位置',
  `signInAt` int(11) NOT NULL COMMENT '当日首次打卡的时间戳',
  `signInRec` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '记录每次打卡的时间段，用|隔开',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for leave_applications
-- ----------------------------
DROP TABLE IF EXISTS `leave_applications`;
CREATE TABLE `leave_applications`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '申请单ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `status` int(11) NOT NULL COMMENT '申请的审批状态',
  `leaveTime` int(11) NOT NULL COMMENT '离校时间',
  `backTime` int(11) NOT NULL COMMENT '返校时间',
  `reason` varchar(210) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '离校理由',
  `pictures` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '附加图片的URL组，URL之间用|隔开',
  `signature` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手写签名图片URL',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for leave_replies
-- ----------------------------
DROP TABLE IF EXISTS `leave_replies`;
CREATE TABLE `leave_replies`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '审批回复ID',
  `uid` int(11) NOT NULL COMMENT '操作者用户ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `aid` int(11) NOT NULL COMMENT '申请ID',
  `type` int(11) NOT NULL COMMENT '回复类型',
  `signature` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '同意审批的审核人签名图片URL',
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '驳回理由',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for order_announcements
-- ----------------------------
DROP TABLE IF EXISTS `order_announcements`;
CREATE TABLE `order_announcements`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '预约中心公告ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `text` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pk_count
-- ----------------------------
DROP TABLE IF EXISTS `pk_count`;
CREATE TABLE `pk_count`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '表计数ID',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '表名',
  `count` int(11) NOT NULL DEFAULT 1 COMMENT '当前最大ID值',
  `version` int(11) NULL DEFAULT 0 COMMENT '乐观锁版本计数',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for preferences
-- ----------------------------
DROP TABLE IF EXISTS `preferences`;
CREATE TABLE `preferences`  (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT '偏好设置ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '偏好名称',
  `value` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '偏好数值',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for school
-- ----------------------------
DROP TABLE IF EXISTS `school`;
CREATE TABLE `school`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '学校ID',
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学校名称',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for user_avatar
-- ----------------------------
DROP TABLE IF EXISTS `user_avatar`;
CREATE TABLE `user_avatar`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户头像ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `url` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像图片URL',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for user_health
-- ----------------------------
DROP TABLE IF EXISTS `user_health`;
CREATE TABLE `user_health`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户健康情况ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `sid` int(11) NOT NULL COMMENT '学校ID',
  `healthy` tinyint(1) NOT NULL DEFAULT 1 COMMENT '用户是否健康',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for user_profile
-- ----------------------------
DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE `user_profile`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户信息ID',
  `uid` int(11) NOT NULL COMMENT '所属用户ID',
  `nickname` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `school` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学校名称',
  `academy` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学院名称',
  `class` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '班级名称',
  `realname` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '真名',
  `sno` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学号',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `role` smallint(6) NOT NULL COMMENT '身份',
  `password` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
