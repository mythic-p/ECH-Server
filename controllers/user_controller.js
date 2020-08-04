// 用户控制器类
// 用于用户相关数据的增删改查
// 关于ROLE（身份）
// 1: 学生 仅可以进行基本操作（默认身份）
// 2: 教师 可以审核学生申请，统计班级打卡情况等操作
// 3: 食堂管理员 可以修改食堂菜品，食堂座位布局，每个座位的椅子摆放
// 4: 澡堂管理员 可以修改澡堂隔间布局，设置澡堂开放时间等澡堂相关设置功能
// 5: 学校管理员 可以修改预约中心的通知公告，
// 6: 社交管理员 可以管理所有评论 进行删除等处罚，可对疫情小知识进行权限管理
// 7: 总管理员 可以进行以上身份的所有操作，并有权停止校疫小助手后台服务器
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = require('../utils/config').GetJWTSecretKey();
const {ecode, ecode2} = require('../utils/');
const {Validator, validationRules} = require('../utils/validator');
/**
 * 用户业务控制器
 */
class UserController {
  /**
   * 注册一个学生身份的用户
   * @param {String} username 被注册的用户名
   * @param {String} password 用户使用的密码
   * @returns {Object} {code, msg} 执行结果和错误信息 
   */
  static async RegisterUser(username, password) {
    username = username.trim();
    password = password.trim();
    const checkRules = [
      [username.length, [validationRules.between, 4, 16], ecode.USER_INVALID_USERNAME],
      [password.length, [validationRules.between, 8, 16], ecode.USER_INVALID_PASSWORD]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {username}})) >= 1;
    if (userExists === true) {
      return ecode2.USER_SAME_USERNAME;
    }
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = await models.users.create({username, password: hashedPassword, role: 1});
    await models.userProfile.create({uid: newUser.getDataValue('id'), nickname: '体验用户', school: 'A学校', academy: 'XX学院', class: 'XX班级', realname: 'XX', sno: 'XXXXX'});
    await models.userAvatar.create({uid: newUser.getDataValue('id')});
    return {...ecode2.SUCCESS, newUser};
  }
  /**
   * 更新一个指定ID的基本用户信息，可修改用户名和身份
   * @param {Number} id 被更新用户的ID
   * @param {Object} updatedProperties 被更新的字段
   * @returns {Object} {code, msg} 执行结果，错误信息
   */
  static async UpdateUser(id, updatedProperties) {
    id = +id;
    try {
      updatedProperties = JSON.parse(updatedProperties);
    } catch (error) {
      return ecode2.UPDATE_FIELDS_INVALID_FORMAT;
    }
    const checkRules = [
      [id, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [Object.keys(updatedProperties).length, [validationRules.greaterThan, 0], ecode.UPDATE_EMPTY_FIELDS]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    models.users.update({...updatedProperties}, {where: {id}});
    return ecode2.SUCCESS;
  }
  /**
   * 更新一个指定ID的用户个人信息
   * @param {Number} id 被更新用户的ID
   * @param {Object} profileInfo 被更新的个人信息字段
   * @returns {Object} {code, msg} 执行结果，错误信息
   */
  static async UpdateUserProfile(id, profileInfo) {
    id = +id;
    try {
      profileInfo = JSON.parse(profileInfo);
    } catch (error) {
      return ecode2.UPDATE_FIELDS_INVALID_FORMAT;
    }
    const checkRules = [
      [id, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [Object.keys(profileInfo).length, [validationRules.greaterThan, 0], ecode.UPDATE_EMPTY_FIELDS]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const profileExists = (await models.userProfile.count({where: {uid: id}})) >= 1;
    if (!profileExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    await models.userProfile.update({...profileInfo}, {where: {uid: id}});
    return ecode2.SUCCESS;
  }
  /**
   * 获取一个指定用户的基本信息，如id，用户名，身份
   * @param {Number} id 用户的ID
   * @returns {Object} {code, msg, user} 结果代码，错误信息，用户对象
   */
  static async GetUserById(id) {
    id = +id;
    const checkRules = [[id, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const user = await models.users.findOne({where: {id}, attributes: {exclude: ['password']}});
    return {...ecode2.SUCCESS, user}
  }
  /**
   * 获取一组用户的基本信息
   * @param {Number} page 页码
   * @param {Number} size 大小
   * @returns {Object} {code, msg, users} 结果代码，错误信息，用户数组
   */
  static async GetUsers(page, size) {
    page = +page || 1;
    size = +size || 5;
    const checkRules = [
      [page, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_PAGE],
      [size, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_SIZE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const users = await models.users.findAll({
      limit: size,
      offset: (page - 1) * size,
      attributes: {exclude: ['password']}
    });
    return {...ecode2.SUCCESS, users};
  }
  /**
   * 获取指定用户的个人信息
   * @param {Number} id 被查询用户的ID
   * @returns {Object} {code, msg, profile} 结果代码，错误信息，用户个人信息
   */
  static async GetUserProfileById(id) {
    id = +id;
    const checkRules = [[id, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const profile = await models.userProfile.findOne({where: {uid: id}, attributes: {exclude: ['createdAt', 'updatedAt', 'id', 'uid']}});
    return {...ecode2.SUCCESS, profile};
  }
  /**
   * 登录操作
   * @param {String} username 登录用的用户名
   * @param {String} password 登录用的密码
   * @returns {Object} {code, msg, token} 结果代码，错误信息，JWT令牌
   */
  static async Login(username, password) {
    username = username.trim();
    password = password.trim();
    const checkRules = [
      [username.length, [validationRules.greaterThan, 0], ecode.USER_INVALID_USERNAME],
      [password.length, [validationRules.greaterThan, 0], ecode.USER_INVALID_PASSWORD]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const exists = (await models.users.count({where: {username}})) >= 1;
    if (!exists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const user = await models.users.findOne({where: {username}, attributes: ['id', 'username', 'password', 'role']});
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return ecode2.USER_INCORRECT_PASSWORD;
    }
    const uid = user.getDataValue('id');
    const profile = await models.userProfile.findOne({where: {uid}, attributes: ['school']});
    const school = await models.school.findOne({where: {name: profile.getDataValue('school')}, attributes: ['id']});
    let token = jwt.sign({role: user.getDataValue('role'), uid, sid: school.getDataValue('id')}, secretKey, {expiresIn: '1d'});
    token = 'Bearer ' + token;
    return {...ecode2.SUCCESS, token};
  }
  /**
   * 根据指定用户ID获取对应的用户头像URL
   * @param {Number} userId 用户ID
   * @returns {Object} {code, msg, avatarUrl} 执行结果，错误信息，用户头像URL
   */
  static async GetUserAvatarById(userId) {
    userId = +userId;
    const checkRules = [[userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const avatarModel = await models.userAvatar.findOne({where: {uid: userId}});
    const avatarUrl = avatarModel ? avatarModel.getDataValue('url') : '';
    return {...ecode2.SUCCESS, avatarUrl};
  }
  /**
   * 给指定用户上传一张新的头像
   * @param {Number} userId 用户ID
   * @param {String} avatarUrl 新头像的URL
   * @returns {Object} {code, msg} 执行结果，错误信息
   */
  static async ModifyUserAvatarById(userId, avatarUrl) {
    userId = +userId;
    avatarUrl = avatarUrl.trim();
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [avatarUrl, [validationRules.isValidURL], ecode.USER_INVALID_AVATAR_URL]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const {'0': avatarModel} = await models.userAvatar.findOrCreate({where: {uid: userId}, defaults: {uid: userId, url: ''}});
    avatarModel.setDataValue('url', avatarUrl);
    await avatarModel.save();
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定用户当前是否健康
   * @param {Number} userId 用户ID
   * @returns {Object} {code, msg, isHealthy} 执行结果，错误信息，是否健康
   */
  static async GetUserHealthById(userId) {
    userId = +userId;
    const checkRules = [[userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const healthModel = await models.userHealth.findOne({where: {uid: userId}});
    const isHealthy = healthModel ? healthModel.getDataValue('healthy') : false;
    return {...ecode2.SUCCESS, isHealthy}
  }
  /**
   * 设置指定用户的健康状态
   * @param {Number} userId 用户ID
   * @param {Number} isHealthy 健康状态
   * @returns {Object} {code, msg} 执行结果，错误信息
   */
  static async SetUserHealthById(userId, isHealthy) {
    userId = +userId;
    isHealthy = isHealthy === '1' ? true : false;
    const checkRules = [[userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const {'0': healthModel} = await models.userHealth.findOrCreate({where: {uid: userId}, defaults: {uid: userId, healthy: false}});
    healthModel.setDataValue('healthy', isHealthy);
    await healthModel.save();
    return ecode2.SUCCESS;
  }
}
module.exports = UserController;