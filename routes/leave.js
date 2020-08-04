const express = require('express');
const router = express.Router();
const LeaveController = require('../controllers/leave_controller');
// 获取指定申请ID的详情
// GET: /order/leave/:aid/
// aid: {必填} 离校申请预约的ID
// sid: {必填} 预约所属的学校ID
router.get('/:aid', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, application} = await LeaveController.GetApplicationById(req.params.aid, sid);
  res.mpJson(code, msg, application);
});
// 撤销一条指定的申请
// POST: /order/leave/:aid/withdraw
// aid: {必填} 被撤销申请的ID
// sid: {必填} 学校ID
router.post('/:aid/withdraw', async (req, res) => {
  const {sid} = req.body;
  const {code, msg} = await LeaveController.WithdrawApplicationById(req.params.aid, sid);
  res.mpJson(code, msg);
})
// 指定用户向学校发起一个离校申请
// POST: /order/leave/
// uid: {必填} 执行提交申请操作的用户ID
// sid: {必填} 学校ID
// leave: {必填} 离校时间的字符串
// back: {必填} 返校实际的字符串
// reason: {必填} 离校原因
// pictures: {选填} 附加图片的url集合，每个url之间用|隔开
// signature: {必填} 手写签名图片的URL
router.post('/', async (req, res) => {
  const {uid, sid, leave, back, reason, pictures, signature} = req.body;
  const {code, msg} = await LeaveController.AddApplication(uid, sid, leave, back, reason, pictures, signature);
  res.mpJson(code, msg);
});
// 获取指定用户一定数量的申请信息列表
// GET: /order/leave/
// uid: {必填} 执行查询操作的用户ID
// sid: {必填} 执行操作用户的所属学校ID
// order: {必填} 获取列表的排序规则
// page: {必填} 查询的页码
// size: {必填} 一次可查询的最多数量
// status: {选填} 指定被查询的申请的状态 不填则默认查询全部状态的申请
router.get('/', async (req, res) => {
  const {uid, sid, order, page, size, status} = req.query;
  const {code, msg, applications} = await LeaveController.GetApplicationsById(uid, sid, order, page, size, status);
  res.mpJson(code, msg, applications);
});
// 获取指定申请的审批回复
// GET: /order/leave/:aid/replies/
// aid: {必填} 被查询回复的申请ID
// sid: {必填} 申请所属的学校ID
router.get('/:aid/replies/', async (req, res) => {
  const {sid} = req.query;
  const {code, msg, data} = await LeaveController.GetApplicationRepliesById(req.params.aid, sid);
  res.mpJson(code, msg, data);
});
// 向指定申请添加一个审批结果
// POST: /order/leave/:aid/replies/
// aid: {必填} 被添加审批结果的申请ID
// uid: {必填} 执行审批操作的用户ID
// sid: {必填} 申请所属的学校ID
// type: {必填} 审批结果的类型
// signature: {选填} 手写签名图片的URL，若审批结果为同意，则必填，否则不填
// reason: {选填} 驳回申请的路由，若审批结果为驳回，则必填，否则不填
router.post('/:aid/replies/', async (req, res) => {
  const {uid, sid, type, signature, reason} = req.body;
  const {code, msg} = await LeaveController.AddApplicationReplyById(uid, req.params.aid, sid, type, signature, reason);
  res.mpJson(code, msg);
});
module.exports = ['/order/leave', router];