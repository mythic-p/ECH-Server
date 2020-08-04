const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');
const logger = require('morgan');
const cors = require('cors');// 跨域中间件

const mapRoutes = require('./routes/mapper');// 引入自动路由函数
const Config = require('./utils/config');// 配置文件
const {registerMomentRules} = require('./utils/moment-rules');// 引入moment.js校验规则
// 实例化Express类
const app = express();
//重新配置
const http = require('http');
const server = http.createServer(app);
// 注册中间件
app.use(express.urlencoded({ extended: false }));// 解析application/x-www-form-urlencoded格式的表单数据
app.use(cookieParser());// 解析Cookie
app.use(express.static(path.join(__dirname, 'public')));// 设置静态文件目录
app.use(cors());// 注册跨域中间件
app.use(expressJwt({// 注册JWT鉴权中间件
  secret: Config.GetJWTSecretKey()
}).unless({
  path: Config.LoadPublicRoutes()
}));
// 自动遍历并加载路由文件
mapRoutes(app);
// 扩展Response方法
const myResp = Object.create(express().response, {
  mpJson: {
    // code: 状态码
    // message: 状态附带的消息
    // data?: 回应数据
    value: function(code, message, data) {
      code = code || 200;
      message = message || '';
      return this.json({code, message, data: (data !== undefined && data != null) ? data : null});
    }
  }
});
app.response = Object.create(myResp);
// 错误处理
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.mpJson(401, '权限不足，禁止访问');// 规定-101是鉴权失败的状态码，同时本地化错误提示
  } else {
    res.mpJson(err.status, err.message);
  }
});
// 注册校验器自定义规则 - moment.js相关
registerMomentRules();
//监听端口
server.listen('3000');