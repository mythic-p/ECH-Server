const express = require('express');
const router = express.Router();
const UtilsController = require('../controllers/utils_controller');
const {Validator, validationRules} = require('../utils/validator');
// 获取服务器本地时间
// GET: /time
router.get('/time', (req, res) => {
  res.mpJson(200, '', UtilsController.GetServerTime());
});
// 获取给定地理位置的逆地理编码
// GET: /location
// lat: {必填} 纬度
// lng: {必填} 经度
router.get('/location', async (req, res) => {
  const {lat, lng} = req.query;
  const {code, msg, data} = await UtilsController.GetLocationInfo(lat, lng);
  res.mpJson(code, msg, data);
});
module.exports = ['/', router];