const models = require('../models');
const {ecode, ecode2} = require('../utils');
const {Validator, validationRules} = require('../utils/validator');

class OrderAnnouncementController {
  /**
   * 更新指定学校的公告内容
   * @param {number} schoolId 学校ID
   * @param {string} content 公告内容
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async UpdateAnnouncementById(schoolId, content) {
    schoolId = +schoolId;
    content = content.trim();
    const checkRules = [
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [content.length, [validationRules.between, 1, 190], ecode.ANNOUNCEMENT_INVALID_CONTENT]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const {'0': announceModel, '1': newCreated} = await models.orderAnnouncements.findOrCreate({where: {sid: schoolId}, defaults: {sid: schoolId, text: content}});
    if (!newCreated) {
      announceModel.setDataValue('text', content);
      await announceModel.save();
    }
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定学校的公告内容
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, content: string}} 执行结果，错误信息，公告内容
   */
  static async GetAnnouncementById(schoolId) {
    schoolId = +schoolId;
    const checkRules = [[schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const announceModel = await models.orderAnnouncements.findOne({where: {sid: schoolId}});
    const content = announceModel ? announceModel.getDataValue('text') : '';
    return {...ecode2.SUCCESS, content};
  }
}
module.exports = OrderAnnouncementController;