const express = require('express');
const router = express.Router();
const PreferenceController = require('../controllers/preference_controller');
const OrderAnnouncementController = require('../controllers/order_announcement_controller');

// 获取指定学校可使用的预约功能
// GET: /order/functions/
// sid: {必填} 学校ID
router.get('/functions/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, value} = await PreferenceController.GetValueByName(sid, 'APPOINTMENT_FUNCTIONS');
  res.mpJson(code, msg, value);
});
// 获取指定学校的最新公告
// GET: /order/announcements/
// sid: {必填} 学校ID
router.get('/announcements/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, content} = await OrderAnnouncementController.GetAnnouncementById(sid);
  res.mpJson(code, msg, content);
});
// 更新或创建指定学校的公告
// POST: /order/announcements/
// sid: {必填} 学校ID
// content: {必填} 公告内容
router.post('/announcements/', async (req, res) => {
  const {sid, content} = req.body;
  const {code, msg} = await OrderAnnouncementController.UpdateAnnouncementById(sid, content);
  res.mpJson(code, msg);
})

module.exports = ['/order', router];