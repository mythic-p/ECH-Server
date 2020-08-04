// 偏好设置路由
const express = require('express');
const router = express.Router();
const PreferenceController = require('../controllers/preference_controller');
// 获取当前学校指定名称的偏好配置
// GET: /preferences/:name
// name: {必填} 偏好配置的名称
// sid: {必填} 学校ID
router.get('/:name', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, value} = await PreferenceController.GetValueByName(sid, req.params.name);
  res.mpJson(code, msg, value);
})
// 设置当前学校指定名称的偏好配置
// POST: /preferences/:name
// name: {必填} 偏好配置的名称
// sid: {必填} 学校ID
// value: {必填} 偏好配置的值
router.post('/:name', async (req, res) => {
  const {value, sid} = req.body;
  const {code, msg} = await PreferenceController.SetValueByName(sid, req.params.name, value);
  res.mpJson(code, msg);
})
module.exports = ['/preferences', router];