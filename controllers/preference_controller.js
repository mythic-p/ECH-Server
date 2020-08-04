// 偏好控制器
const {ecode, ecode2} = require('../utils/');
const models = require('../models/');
const {Validator, validationRules} = require('../utils/validator');
class PreferenceController {
  /**
   * 获取一个指定名称的偏好参数的值
   * @param {number} schoolId 学校ID
   * @param {string} name 偏好设置名称
   * @returns {{code: number, msg: string, value: string}} 执行结果，错误信息，偏好配置值
   */
  static async GetValueByName(schoolId, name) {
    schoolId = +schoolId;
    name = name.trim();
    const checkRules = [
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name.length, [validationRules.between, 1, 30], ecode.PREFERENCE_INVALID_NAME]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const prefModel = await models.preferences.findOne({where: {sid: schoolId, name}});
    if (!prefModel) {
      return ecode2.PREFERENCE_NOT_EXISTS;
    }
    return {...ecode2.SUCCESS, value: prefModel.getDataValue('value')};
  }
  /**
   * 检测一个指定的偏好配置是否存在
   * @param {number} schoolId 学校ID
   * @param {string} name 偏好配置名
   * @returns {{code: number, msg: string, prefExists: boolean}} 执行结果，错误信息，偏好配置是否存在
   */
  static async CheckNameExists(schoolId, name) {
    schoolId = +schoolId;
    name = name.trim();
    const checkRules = [
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name.length, [validationRules.between, 1, 30], ecode.PREFERENCE_INVALID_NAME]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const prefExists = (await models.preferences.count({where: {sid: schoolId, name}})) >= 1;
    return {...ecode2.SUCCESS, prefExists};
  }
  /**
   * 给指定的偏好配置设置一个值
   * @param {number} schoolId 学校ID
   * @param {string} name 偏好配置名
   * @param {string} value 偏好配置值
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async SetValueByName(schoolId, name, value) {
    schoolId = +schoolId;
    name = name.trim();
    value = value.trim();
    const checkRules = [
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name, [validationRules.between, 1, 30], ecode.PREFERENCE_INVALID_NAME],
      [value, [validationRules.between, 1, 200], ecode.PREFERENCE_INVALID_VALUE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const pkName = `pref_${schoolId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    const {'0': prefModel, '1': newCreated} = await models.preferences.findOrCreate({attributes: ['id'], where: {sid: schoolId, name}, defaults: {id: pkModel.getDataValue('count'), sid: schoolId, name, value: ''}});
    newCreated && await pkModel.increment('count', {by: 1});
    await models.preferences.update({value}, {where: {id: prefModel.getDataValue('id'), sid: schoolId}});
    return ecode2.SUCCESS;
  }
}
module.exports = PreferenceController;