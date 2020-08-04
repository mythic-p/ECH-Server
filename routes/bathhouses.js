const express = require('express');
const router = express.Router();
const BathhouseController = require('../controllers/bathhouse_controller');
// 获取指定学校的澡堂列表
// GET: /order/bathhouses/
// sid: {必填} 学校ID
router.get('/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, bathhouses} = await BathhouseController.GetBathhousesById(sid);
  res.mpJson(code, msg, bathhouses);
});
// 向指定学校添加一个澡堂信息
// POST: /order/bathhouses/
// sid: {必填} 学校ID
// name: {必填} 澡堂的名称
// code: {必填} 澡堂的订单代号 为3个大写英文字母
router.post('/', async (req, res) => {
  const {sid, name, code: _code} = req.body;
  const {code, msg} = await BathhouseController.AddBathhouseById(sid, name, _code);
  res.mpJson(code, msg);
});
// 向指定学校的指定澡堂添加一个淋浴位
// POST: /order/bathhouses/:bid/seats/
// sid: {必填} 学校ID
// bid: {必填} 澡堂ID
// code: {必填} 淋浴位编号
router.post('/:bid/seats/', async (req, res) => {
  const {sid, code: _code} = req.body;
  const {code, msg} = await BathhouseController.AddBathhouseSeatById(req.params.bid, sid, _code);
  res.mpJson(code, msg);
});
// 获取指定用户在指定澡堂的指定时间段内 淋浴位使用情况和相关信息
// GET: /order/bathhouses/:bid/seats/
// sid: {必填} 学校ID
// bid: {必填} 澡堂ID
// uid: {必填} 查询情况的用户ID
// begin: {必填} 时间段的起始时间
// end: {必填} 时间段的结束时间
router.get('/:bid/seats/', async (req, res) => {
  const {sid, begin, end, uid} = req.query;
  const {code, msg, seats} = await BathhouseController.GetBathhouseSeatsById(req.params.bid, sid, begin, end, uid);
  res.mpJson(code, msg, seats);
});
// 向指定澡堂添加一个预约
// POST: /order/bathhouses/:bid/appointments/
// bid: {必填} 澡堂ID
// uid: {必填} 发起预约的用户ID
// sid: {必填} 发起预约用户的学校ID
// seat: {必填} 淋浴位ID
// begin: {必填} 预约的开始洗浴时间
// end: {必填} 预约的结束洗浴时间
router.post('/:bid/appointments/', async (req, res) => {
  const {uid, sid, seat, begin, end} = req.body;
  const {code, msg} = await BathhouseController.AddAppointment(uid, sid, req.params.bid, seat, begin, end);
  res.mpJson(code, msg);
});
// 获取指定澡堂的指定预约的详情
// GET: /order/bathhouses/:bid/appointments/:aid/
// bid: {必填} 澡堂ID
// aid: {必填} 被查询的预约ID
// sid: {必填} 澡堂所属的学校ID
router.get('/:bid/appointments/:aid/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, appointment} = await BathhouseController.GetAppointmentById(req.params.aid, sid, req.params.bid);
  res.mpJson(code, msg, appointment);
});
// 获取指定用户在指定学校的预约列表
// GET: /order/bathhouses/appointments/
// uid: {必填} 进行查询操作的用户的ID
// sid: {必填} 进行操作用户的所属学校的ID
// order: {必填} 查询列表的排序规则
// page: {必填} 列表的页码
// size: {必填} 列表的大小
// status: {选填} 获取指定状态的预约列表，不填则获取全部预约
router.get('/appointments/', async (req, res) => {
  const {uid, sid, order, page, size, status} = req.query;
  const {code, msg, appointments} = await BathhouseController.GetAppointmentsById(uid, sid, order, page, size, status);
  res.mpJson(code, msg, appointments);
});
// 取消一个指定预约
// POST: /order/bathhouses/:bid/appointments/:aid/cancel
// bid: {必填} 被取消预约所属的澡堂ID
// aid: {选填} 被取消预约的ID，若有begin和end，则不填，否则必填
// uid: {必填} 预约所属的用户ID
// sid: {必填} 预约所属的学校ID
// begin: {选填} 被取消预约的起始时间，有有效aid则不填，否则必填
// end: {选填} 被取消取消的结束时间，若填写了begin，则必填 否则不填
router.post('/:bid/appointments/:aid/cancel', async (req, res) => {
  const {uid, sid, begin, end} = req.body;
  let obj;
  if (begin && end) {
    obj = await BathhouseController.CancelAppointmentByTime(uid, sid, req.params.bid, begin, end);
  } else {
    obj = await BathhouseController.CancelAppointmentById(req.params.aid, sid, req.params.bid);
  }
  res.mpJson(obj.code, obj.msg);
});

module.exports = ['/order/bathhouses', router];