const path = require('path');
const fs = require('fs');
// 自动注册路由规定
// 路由文件的exports为一个数组，只有两个元素
// [路由前缀, router实例]
/**
 * 实现运行Express服务时自动注册路由
 * @param {Express} expressInst Express实例
 */
module.exports = expressInst => {
  const curDirPath = path.resolve('routes');
  const filePaths = fs.readdirSync(curDirPath);
  filePaths.forEach(filePath => {
    if (/\.js$/.test(filePath) && filePath !== 'mapper.js') {
      filePath = path.resolve('routes', filePath.replace('.js', ''));
      const router = require(filePath);
      expressInst.use(router[0], router[1]);
    }
  });
}