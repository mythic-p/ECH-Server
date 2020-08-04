const models = require('../models');
const {checkConvertedNumberValid, getValidOrder, convertOrderToArray, ecode, ecode2} = require('../utils');
const {Validator, validationRules} = require('../utils/validator');
const {momentRules} = require('../utils/moment-rules');
const moment = require('moment');
const PreferenceController = require('./preference_controller');
/**
 * 获取合法的审批结果类型
 */
const getValidType = () => [1, 2, 3];

class LeaveController {
  /**
   * 指定用户向学校提交一份离校申请
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} leaveTime 离校时间
   * @param {number} backTime 返校时间
   * @param {string} reason 离校原因
   * @param {string} pictures 附加图片URL组
   * @param {string} signature 手写签名URL
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddApplication(userId, schoolId, leaveTime, backTime, reason, pictures, signature) {
    userId = +userId;
    schoolId = +schoolId;
    reason = reason.trim();
    signature = signature.trim();
    leaveTime = moment(leaveTime);
    backTime = moment(backTime);
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [leaveTime, [momentRules.isValid], ecode.BEGIN_TIME_INVALID],
      [backTime, [momentRules.isValid], ecode.END_TIME_INVALID],
      [leaveTime, [momentRules.isAfter, backTime], ecode.LEAVE_INVALID_LEAVE_BACK_TIME],
      [reason.length, [validationRules.between, 1, 200], ecode.LEAVE_INVALID_LEAVE_REASON],
      [signature.length, [validationRules.isValidURL], ecode.LEAVE_INVALID_SIGNATURE_URL]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    leaveTime = leaveTime.unix();
    backTime = backTime.unix();
    const pkName = `leave_${schoolId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.leaveApplications.create({id: pkModel.getDataValue('count'), sid: schoolId, uid: userId, status: 1, leaveTime, backTime, reason, pictures, signature});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定申请ID的申请详情
   * @param {number} applicationId 申请ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, application: {uid: number, status: number, leaveTime: number, backTime: number, reason: string, pictures?: string, signature: string}}} 执行结果，错误信息，申请详情
   */
  static async GetApplicationById(applicationId, schoolId) {
    applicationId = +applicationId;
    schoolId = +schoolId;
    const checkRules = [
      [applicationId, [validationRules.greaterThan, 0], ecode.LEAVE_INVALID_APPLICATION_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const application = await models.leaveApplications.findOne({where: {id: applicationId, sid: schoolId}, attributes: {exclude: ['_id', 'sid', 'id', 'createdAt', 'updatedAt']}});
    return {...ecode2.SUCCESS, application};
  }
  /**
   * 获取指定用户的一组申请信息详情
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} order 排序规则
   * @param {number} page 页码
   * @param {number} size 大小
   * @param {number} status 获取指定状态的申请
   * @returns {{code: number, msg: string, applications: {id: number, status: number, leaveTime: number, backTime: number, reason: string, pictures?: string, signature: string}[]}}  执行结果，错误信息，申请信息列表
   */
  static async GetApplicationsById(userId, schoolId, order, page, size, status) {
    userId = +userId;
    schoolId = +schoolId;
    order = +order;
    page = +page || 1;
    size = +size || 5;
    status = +status;
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [order, [validationRules.include, getValidOrder()], ecode.SORT_INVALID_ORDER],
      [page, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_PAGE],
      [size, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_SIZE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    let other = {};
    if (checkConvertedNumberValid(status, true)) {
      other = {status};
    }
    order = convertOrderToArray(order);
    const applications = await models.leaveApplications.findAll({
      where: {uid: userId, sid: schoolId, ...other},
      offset: (page - 1) * size,
      limit: size,
      order,
      attributes: {exclude: ['_id', 'sid', 'uid', 'createdAt', 'updatedAt']}
    });
    return {...ecode2.SUCCESS, applications};
  }
  /**
   * 获取指定申请的审批情况列表
   * @param {number} applicationId 申请ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, replies: {id: number, uid: number, type: number, signature?: string, reason?: string}[]}} 执行结果，错误信息，审批详情
   */
  static async GetApplicationRepliesById(applicationId, schoolId) {
    applicationId = +applicationId;
    schoolId = +schoolId;
    const checkRules = [
      [applicationId, [validationRules.greaterThan, 0], ecode.LEAVE_INVALID_APPLICATION_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const applicationExists = (await models.leaveApplications.count({where: {id: applicationId, sid: schoolId}})) >= 1;
    if (!applicationExists) {
      return ecode2.LEAVE_APPLICATION_NOT_EXISTS;
    }
    const replies = await models.leaveReplies.findAll({where: {aid: applicationId, sid: schoolId}, attributes: {exclude: ['_id', 'sid', 'aid', 'updatedAt']}});
    let {value: judgeStages} = await PreferenceController.GetValueByName(schoolId, 'LEAVE_JUDGE_STAGES');
    judgeStages = parseInt(judgeStages);
    return {...ecode2.SUCCESS, data: {stages: judgeStages, replies}};
  }
  /**
   * 对指定申请添加一个审批结果
   * @param {number} userId 用户ID
   * @param {number} applicationId 申请ID
   * @param {number} schoolId 学校ID
   * @param {number} type 审批结果类型
   * @param {string} signature 审核人的手写签名图片URL，当同意时有效
   * @param {string} reason 审核人的驳回理由，当驳回时有效
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddApplicationReplyById(userId, applicationId, schoolId, type, signature, reason) {
    userId = +userId;
    applicationId = +applicationId;
    schoolId = +schoolId;
    type = +type;
    let checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [applicationId, [validationRules.greaterThan, 0], ecode.LEAVE_INVALID_APPLICATION_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [type, [validationRules.include, getValidType()], ecode.LEAVE_INVALID_REPLY_TYPE]
    ];
    if (type === 1) {
      signature = signature.trim();
      const extraRule = [[signature.length, [validationRules.greaterThan, 0], ecode.LEAVE_INVALID_SIGNATURE_URL]];
      checkRules = checkRules.concat(extraRule);
    } else if (type === 2) {
      reason = reason.trim();
      const extraRule = [[reason.length, [validationRules.between, 1, 240], ecode.LEAVE_INVALID_REJECT_REASON]];
      checkRules = checkRules.concat(extraRule);
    }
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const applicationExists = (await models.leaveApplications.count({where: {id: applicationId, sid: schoolId}})) >= 1;
    if (!applicationExists) {
      return ecode2.LEAVE_APPLICATION_NOT_EXISTS;
    }
    const hasJudged = (await models.leaveReplies.count({where: {uid: userId, sid: schoolId, aid: applicationId}})) >= 1;
    if (hasJudged) {
      return ecode2.LEAVE_HAS_REPLIED;
    }
    const pkName = `leave_reply_${schoolId}_${applicationId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.leaveReplies.create({id: pkModel.getDataValue('count'), uid: userId, sid: schoolId, aid: applicationId, type, signature, reason});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 撤销一条指定的申请信息
   * @param {number} applicationId 申请ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async WithdrawApplicationById(applicationId, schoolId) {
    applicationId = +applicationId;
    schoolId = +schoolId;
    const checkRules = [
      [applicationId, [validationRules.greaterThan, 0], ecode.LEAVE_INVALID_APPLICATION_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const application = (await models.leaveApplications.findOne({where: {id: applicationId, sid: schoolId}}));
    if (!application) {
      return ecode2.LEAVE_APPLICATION_NOT_EXISTS;
    }
    if (application.getDataValue('status') !== 1) {
      return ecode2.LEAVE_CAN_NOT_WITHDRAW;
    }
    let {value: judgeStages} = await PreferenceController.GetValueByName(schoolId, 'LEAVE_JUDGE_STAGES');
    let {value: judgers} = await PreferenceController.GetValueByName(schoolId, 'LEAVE_JUDGERS');
    judgeStages = parseInt(judgeStages);
    judgers = judgers.split('|');
    if (!checkConvertedNumberValid(judgeStages)) {
      return ecode2.LEAVE_INVALID_JUDGE_STAGES;
    }
    if (!judgers || judgers.length !== judgeStages) {
      return ecode2.LEAVE_INVALID_JUDGER_NUMBER;
    }
    const pkName = `leave_reply_${schoolId}_${applicationId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, default: {name: pkName, count: 1}});
    for (let i = 0; i < judgeStages; i++) {
      const judgerUID = parseInt(judgers[i]);
      const {'1': newCreated} = await models.leaveReplies.findOrCreate({where: {aid: applicationId, sid: schoolId, uid: judgerUID}, defaults: {id: pkModel.getDataValue('count'), aid: applicationId, sid: schoolId, uid: judgerUID, type: 3}});
      if (newCreated) {
        await pkModel.increment('count', {by: 1});
        await pkModel.reload();
      }
    }
    await models.leaveApplications.update({status: 4}, {where: {id: applicationId, sid: schoolId}});
    return ecode2.SUCCESS;
  }
}

module.exports = LeaveController;