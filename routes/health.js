const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/health_controller');

// 指定ID的用户进行健康打卡操作
// POST: /health/:uid
router.post('/:uid', async (req, res) => {
  const {temp, loc, sid} = req.body;
  const {code, msg} = await HealthController.DailySignIn(req.params.uid, sid, temp, loc);
  res.mpJson(code, msg);
});
// 获取指定用户在服务器时间，当天的打卡情况
// GET: /health/:uid
router.get('/:uid', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, signInStatus} = await HealthController.GetSignInStatusById(req.params.uid, sid);
  res.mpJson(code, msg, signInStatus);
});
// 获取指定用户在指定年份和指定月份的打卡情况列表
// POST: /health/:uid/list
router.get('/:uid/list', async (req, res) => {
  const {sid, year, month} = req.query;
  const {code, msg, signInStatuses} = await HealthController.GetSignInStatusesByDate(req.params.uid, sid, year, month);
  res.mpJson(code, msg, signInStatuses);
});

module.exports = ['/health', router];