const moment = require('moment');
const config = require('../utils/config');
const http = require('http');
const {ecode, ecode2} = require('../utils');
const {Validator, validationRules} = require('../utils/validator');
/**
 * 杂项控制器
 */
class UtilsController {
  /**
   * 获取经过格式化后的服务器时间
   * @returns {String} 被格式化后的服务器时间字符串
   */
  static GetServerTime() {
    return moment().format();
  }
  /**
   * 通过指定的经纬度，获取其逆地理编码
   * @param {Number} latitude 纬度
   * @param {Number} longitude 经度
   * @returns {Object} {code, msg, data} 执行结果，错误信息，逆地理编码数据
   */
  static GetLocationInfo(latitude, longitude) {
    latitude = +latitude;
    longitude = +longitude;
    return new Promise((success, fail) => {
      const checkRules = [
        [latitude, [validationRules.between, -90, 90], ecode.GEO_INVALID_LATITUDE],
        [longitude, [validationRules.between, -180, 180], ecode.GEO_INVALID_LONGITUDE]
      ];
      const checkResult = new Validator(checkRules).Validate();
      if (checkResult) {
        fail({...checkResult});
        return;
      }
      http.get(`${config.GetBaiDuMapAPI()}?ak=${config.GetBaiDuAK()}&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`, res => {
        let data = '';
        res.on('data', (chunk) => {data += chunk.toString();});
        res.on('end', () => {
          try {
            const {province, city, district} = JSON.parse(data).result.addressComponent;
            success({...ecode2.SUCCESS, data: {province, city, district}});
          } catch (error) {
            fail({code: 400, msg: error});
          }
        });
      });
    });
  }
}
module.exports = UtilsController;