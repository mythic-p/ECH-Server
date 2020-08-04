const fs = require('fs');
const path = require('path');
/**
 * 后端常量静态类
 */
class Config {
  /**
   * 获取JWT签名密钥
   * @returns {string} JWT密钥字符串
   */
  static GetJWTSecretKey() {
    return "FILL OUT YOUR OWN SECRET KEY";
  }
  /**
   * 获取百度地图的AK
   * @returns {string} AK字符串
   */
  static GetBaiDuAK() {
    return "FILL OUT YOUR OWN BAIDU AK";
  }
  /**
   * 获取百度逆地理编码的API URL
   * @returns {string} 百度逆地理编码API的URL
   */
  static GetBaiDuMapAPI() {
    return "http://api.map.baidu.com/reverse_geocoding/v3/";
  }
  /**
   * 通过本地配置文件获取无需鉴权的路由URL
   * @returns {string[]} 无需鉴权的路由URL数组
   */
  static LoadPublicRoutes() {
    const configPath = path.resolve('config', 'public.json');
    let publicRoutes = [];
    if (fs.existsSync(configPath)) {
      const routesStr = fs.readFileSync(configPath, {encoding: 'utf-8'});
      publicRoutes = JSON.parse(routesStr);
      if (!Array.isArray(publicRoutes)) {
        throw "公开路由配置必须是数组";
      }
      publicRoutes.forEach(route => {
        if (typeof route === 'object') {
          if (route.isRegexp) {
            route.url = new RegExp(route.url);
          }
        }
      })
    }
    return publicRoutes;
  }
}
module.exports = Config;