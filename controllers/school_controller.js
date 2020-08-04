const models = require('../models');
const {ecode, ecode2} = require('../utils');
const {validationRules, Validator} = require('../utils/validator');
/**
 * 学校控制器
 */
class SchoolController {
  /**
   * 获取学校的名称
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, school: string}} 执行结果，错误信息，学校名称
   */
  static async GetSchoolById(schoolId) {
    schoolId = +schoolId;
    const checkRules = [[schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]];
    const checkResult = new Validator(checkRules).Validate(checkRules);
    if (checkResult) {
      return {...checkResult};
    }
    const school = await models.school.findOne({where: {id: schoolId}, attributes: ['name']});
    return {...ecode2.SUCCESS, school};
  }
  /**
   * 新建一所学校
   * @param {string} name 学校名称
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddSchool(name) {
    name = name.trim();
    const checkRules = [[name.length, [validationRules.between, 1, 20], ecode.SCHOOL_INVALID_NAME]];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({name})) >= 1;
    if (schoolExists) {
      return ecode2.SCHOOL_SAME_NAME;
    }
    await models.school.create({name});
    return ecode2.SUCCESS;
  }
}
module.exports = SchoolController;