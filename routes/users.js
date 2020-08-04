const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');

// 通过ID获得指定的用户信息
// GET: users/:id
// id: {必填} 用于获取信息的用户ID
router.get('/:id', async function(req, res) {
  const {code, msg, user} = await UserController.GetUserById(req.params.id);
  res.mpJson(code, msg, user);
});
// 获得一组用户
// GET: users/
// page: {必填} 批量选取时需要的页码
// size: {必填} 一次可最多获取多少个数据
router.get('/', async (req, res) => {
  const {code, msg, users} = await UserController.GetUsers(req.query.page, req.query.size);
  res.mpJson(code, msg, users);
});
// 增添新用户
// POST: users/
// username: {必填} 用户名，长度为4~16个字符
// password: {必填} 密码，长度为8~16个字符
router.post('/', async (req, res) => {
  const {code, msg, newUser} = await UserController.RegisterUser(req.body.username, req.body.password);
  res.mpJson(code, msg, newUser);
});
// 修改用户基本信息
// PUT: users/:id
// id: {必填} 被修改信息的用户的ID
// data: {必填} 需要更新的数据的JSON格式字符串
router.put('/:id', async (req, res) => {
  const {code, msg} = await UserController.UpdateUser(req.params.id, req.body.data);
  res.mpJson(code, msg, null);
});
// 修改用户个人信息
// PUT: users/:uid/profile
// uid: {必填} 被修改个人信息的用户的ID
// data: {必填} 需要更新的数据的JSON格式字符串
router.put('/:uid/profile', async (req, res) => {
  const {code, msg} = await UserController.UpdateUserProfile(req.params.uid, req.body.data);
  res.mpJson(code, msg, null);
});
// 获取用户个人信息
// GET: users/:uid/profile
// uid: {必填} 需要获取个人信息的用户ID
router.get('/:uid/profile', async (req, res) => {
  const {code, msg, profile} = await UserController.GetUserProfileById(req.params.uid);
  res.mpJson(code, msg, profile);
});
// 登录
// POST: /users/login/
// username: {必填} 需要登录的用户的用户名
// password: {必填} 需要登录的用户的登录密码
router.post('/login/', async (req, res) => {
  const {code, msg, token} = await UserController.Login(req.body.username, req.body.password);
  res.mpJson(code, msg, token);
});
// 获取指定用户的头像URL
// GET: /users/:uid/avatar
// uid: {必填} 需要获取头像的用户ID
router.get('/:uid/avatar', async (req, res) => {
  const {code, msg, avatarUrl} = await UserController.GetUserAvatarById(req.params.uid);
  res.mpJson(code, msg, avatarUrl);
});
// 上传指定用户提供的头像
// PUT: /users/:uid/avatar
// uid: {必填} 需要上传/修改头像的用户ID
// url: {必填} 新头像的图片URL
router.put('/:uid/avatar', async (req, res) => {
  const {url} = req.body;
  console.log(req.body)
  const {code, msg} = await UserController.ModifyUserAvatarById(req.params.uid, url);
  res.mpJson(code, msg);
});
// 获取指定用户的健康情况
// GET: /users/:uid/health
// uid: {必填} 需要查看健康情况的用户ID
router.get('/:uid/health', async (req, res) => {
  const {code, msg, isHealthy} = await UserController.GetUserHealthById(req.params.uid);
  res.mpJson(code, msg, isHealthy);
});
// 修改指定用户的健康情况
// PUT: /users/:uid/health
// uid: {必填} 需要修改健康情况的用户ID
// healthy: {必填} 要修改成的健康情况
router.put('/:uid/health', async (req, res) => {
  const {healthy} = req.body;
  const {code, msg} = await UserController.SetUserHealthById(req.params.uid, healthy);
  res.mpJson(code, msg);
});

module.exports = ['/users', router];