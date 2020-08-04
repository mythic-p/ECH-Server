const express = require('express');
const router = express.Router();
const CanteenController = require('../controllers/canteen_controller');

// 获取指定学校的食堂列表
// GET: /order/canteens/
// sid: {必填} 学校ID
router.get('/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, canteens} = await CanteenController.GetCanteensById(sid);
  res.mpJson(code, msg, canteens);
});
// 获取被指定ID的食堂的信息
// GET: /order/canteens/get/:cid
// cid: {必填} 食堂ID
// sid: {必填} 食堂所属的学校ID
router.get('/get/:cid', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, canteen} = await CanteenController.GetCanteenById(req.params.cid, sid);
  res.mpJson(code, msg, canteen);
})
// 添加一个新的食堂
// POST: /order/canteens/
// sid: {必填} 学校ID
// name: {必填} 食堂名称
// code: {必填} 食堂专属的订单代号
router.post('/', async (req, res) => {
  const {sid, name, code: _code} = req.body;
  const {code, msg} = await CanteenController.AddCanteen(sid, name, _code);
  res.mpJson(code, msg);
});
// 获取指定食堂的所有菜品分类
// GET: /order/canteens/:cid/categories/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
router.get('/:cid/categories/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, categories} = await CanteenController.GetCanteenCategoriesById(req.params.cid, sid);
  res.mpJson(code, msg, categories);
});
// 给指定食堂添加一个新的菜品类别
// POST: /order/canteens/:cid/categories/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
// name: {必填} 类别名称
router.post('/:cid/categories/', async (req, res) => {
  const {sid, name} = req.body;
  const {code, msg} = await CanteenController.AddCanteenCategory(req.params.cid, sid, name);
  res.mpJson(code, msg);
});
// 获取指定食堂 指定类别的菜品菜单
// GET: /order/canteens/:cid/categories/:catId/menu/
// cid: {必填} 食堂ID
// catId: {必填} 类别ID
// sid: {必填} 学校ID
router.get('/:cid/categories/:catId/menu/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, items} = await CanteenController.GetCanteenMenuById(req.params.cid, sid, req.params.catId);
  res.mpJson(code, msg, items);
});
// 给指定食堂的指定类别添加一组菜品
// POST: /order/canteens/:cid/categories/:catId/menu
// cid: {必填} 食堂ID
// catId: {必填} 类别ID
// sid: {必填} 学校ID
// items: {必填} 菜品列表
router.post('/:cid/categories/:catId/menu/', async (req, res) => {
  const {sid, items} = req.body;
  const {code, msg} = await CanteenController.AddCanteenCategoryItems(req.params.cid, sid, req.params.catId, items);
  res.mpJson(code, msg);
});
// 获取指定食堂在指定时间段的餐桌使用情况
// GET: /order/canteens/:cid/tables/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
// begin: {必填} 起始查询时间
// end: {必填} 结束查询时间
router.get('/:cid/tables/', async (req, res) => {
  const {sid, begin, end} = req.query;
  const {code, msg, data} = await CanteenController.GetCanteenTablesById(req.params.cid, sid, begin, end);
  res.mpJson(code, msg, data);
});
// 给指定食堂添加一张桌子和多个椅子布局信息
// POST: /order/canteens/:cid/tables/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
// code: {必填} 餐桌代号
// seats: {必填} 座位信息列表
router.post('/:cid/tables/', async (req, res) => {
  const {sid, code: _code, seats} = req.body;
  const {code, msg} = await CanteenController.AddCanteenTable(req.params.cid, sid, _code, seats);
  res.mpJson(code, msg);
});
// 获取指定食堂指定餐桌的椅子布局信息
// GET: /order/canteens/:cid/tables/:tid/chairs/
// cid: {必填} 食堂ID
// tid: {必填} 餐桌ID
// sid: {必填} 学校ID
router.get('/:cid/tables/:tid/chairs/', async (req, res) => {
  const {sid, begin, end} = req.query;
  const {code, msg, chairs} = await CanteenController.GetCanteenTableChairsById(req.params.cid, sid, req.params.tid, begin, end);
  res.mpJson(code, msg, chairs);
});
// 向指定食堂发起一个预约
// POST: /order/canteens/:cid/appointments/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
// uid: {必填} 发起预约的用户的ID
// type: {必填} 预约的类型
// items: {必填} 预约选中的菜品列表，菜品ID之间用|隔开
// begin: {必填} 开始堂食的时间/期望外卖送达的时间/预计来店自取的时间
// end: {选填} 结束堂食的时间，若type=1，则必填，其他情况该参数无效
// seat: {选填} 座位的ID，当type=1时有效，且必填
// tid: {选填} 餐桌的ID，当type=1时有效，且必填
router.post('/:cid/appointments/', async (req, res) => {
  const {uid, sid, type, items, begin, end, seat, tid} = req.body;
  const {code, msg} = await CanteenController.AddAppointment(uid, sid, req.params.cid, type, items, begin, end, seat, tid);
  res.mpJson(code, msg);
});
// 获取指定食堂的指定预约信息
// GET: /order/canteens/:cid/appointments/:aid/
// cid: {必填} 食堂ID
// aid: {必填} 预约单号ID
// sid: {必填} 学校ID
router.get('/:cid/appointments/:aid/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, appointment} = await CanteenController.GetAppointmentById(req.params.aid, req.params.cid, sid);
  res.mpJson(code, msg, appointment);
});
// 获取一组属于指定用户在指定食堂的预约信息
// GET: /order/canteens/appointments/
// cid: {必填} 食堂ID
// sid: {必填} 学校ID
// order: {必填} 排序规则
// page: {必填} 页码
// size: {必填} 大小
router.get('/appointments/', async (req, res) => {
  const {sid, uid, order, page, size, status, begin, end} = req.query;
  const {code, msg, appointments} = await CanteenController.GetAppointmentsById(uid, sid, order, page, size, status, begin, end);
  res.mpJson(code, msg, appointments);
});

module.exports = ['/order/canteens', router];