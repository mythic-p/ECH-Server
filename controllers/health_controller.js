// 健康打卡控制器
const moment = require('moment');
const {checkConvertedNumberValid, ecode, ecode2} = require('../utils/');
const {Validator, validationRules} = require('../utils/validator');
const PreferenceController = require('./preference_controller');
const models = require('../models/');
const {gte, lte} = require('sequelize').Op;

/**
 * 检测当前时间是否可以打卡
 * @param {string} signInInterval 打卡时间间隔配置字符串
 * @param {moment.Moment} curTime 当前服务器时间
 * @param {string} curSignInRecord 当前已打卡的时间段
 * @returns {{checkResult: boolean, timeSlot: number, msg: string}} 检测结果，可打卡的时间段索引，错误信息
 */
const checkSignInTimeValid = (signInInterval, curTime, curSignInRecord) => {
  signInInterval = signInInterval.trim().split('|');
  const curTimeStr = curTime.format('YYYY-MM-DD');
  let checkResult = false, timeSlot = -1, result = {};
  signInInterval.some((interval, index) => {
    interval = interval.split('~');
    if (curTime.isBetween(`${curTimeStr} ${interval[0]}`, `${curTimeStr} ${interval[1]}`)) {
      if (curSignInRecord.indexOf(index) === -1) {
        checkResult = true;
        timeSlot = index;
        return true;
      }
      result = ecode2.HEALTH_SIGNIN_HAS_DONE;
      return true;
    }
    return false;
  });
  if (!checkResult && Object.keys(result).length === 0) {
    result = ecode2.HEALTH_SIGNIN_NOT_AVAILABLE;
  }
  return {checkResult, timeSlot, result};
}

class HealthController {
  /**
   * 指定用户在当前服务器时间进行健康打卡操作
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} temperature 打卡时登记的温度
   * @param {string} geoLocation 打卡时的地理位置，(latitude,longitude)是格式
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async DailySignIn(userId, schoolId, temperature, geoLocation) {
    userId = +userId;
    schoolId = +schoolId;
    temperature = +temperature;
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [temperature, [validationRules.between, 36, 40], ecode.HEALTH_INVALID_TEMPERATURE],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]
    ];
    const checkResult2 = new Validator(checkRules).Validate();
    if (checkResult2) {
      return {...checkResult2};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    let {value: needLoc} = await PreferenceController.GetValueByName(schoolId, 'SIGNIN_NEED_LOCATION');
    needLoc = needLoc === 'true' ? true : false;
    if (needLoc && geoLocation.trim().length < 1) {
      return ecode2.HEALTH_INVALID_GEO_LOCATION;
    } else if (geoLocation.trim().length >= 1 && !(/\(\d+\.?\d*\,\d+\.?\d*\)/.test(geoLocation))) {
      return ecode2.HEALTH_INVALID_GEO_DATA_FORMAT;
    }
    let {value: needSignInTimes} = await PreferenceController.GetValueByName(schoolId, 'SIGNIN_DAILY_TIMES');
    needSignInTimes = +needSignInTimes;
    if (!checkConvertedNumberValid(needSignInTimes, true)) {
      return ecode2.HEALTH_INVALID_SIGNIN_TIMES;
    }
    const {value: signInInterval} = await PreferenceController.GetValueByName(schoolId, 'SIGNIN_DAILY_INTERVAL');
    if (!signInInterval) {
      return ecode2.HEALTH_INVALID_SIGNIN_INTERVAL;
    }
    const curTime = moment(), curDayTimestamp = moment().startOf('day').unix();
    const pkName = `signin_${schoolId}_${curTime.format('YYYYMMDD')}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    const {'0': signInModel, '1': newCreated} = await models.healthySignIn.findOrCreate({where: {uid: userId, sid: schoolId, signInAt: curDayTimestamp}, defaults: {id: pkModel.getDataValue('count'), uid: userId, sid: schoolId, signInAt: curDayTimestamp, temperature: '', location: '', count: 0, signInRec: ''}});
    if (signInModel.getDataValue('count') + 1 > needSignInTimes) {
      return ecode2.HEALTH_FULL_SIGNIN;
    }
    const recStr = signInModel.getDataValue('signInRec');
    const {checkResult, timeSlot, result} = checkSignInTimeValid(signInInterval, curTime, recStr);
    if (!checkResult && typeof result === 'object') {
      return {...result};
    }
    const tempStr = `${signInModel.getDataValue('temperature')}${temperature}|`;
    const locStr = geoLocation.trim().length > 0 ? `${signInModel.getDataValue('location')}${geoLocation}|` : '';
    newCreated && await pkModel.increment('count', {by: 1});
    await models.healthySignIn.update({count: signInModel.getDataValue('count') + 1, temperature: tempStr, location: locStr, signInRec: `${recStr}${timeSlot}|`}, {where: {uid: userId, sid: schoolId, signInAt: curDayTimestamp}});
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定用户在服务器时间，当天的打卡情况
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID2
   * @returns {{code: number, msg: string, signInStatus: {cur: number, total: number}}} 执行结果，错误信息，打卡情况
   */
  static async GetSignInStatusById(userId, schoolId) {
    userId = +userId;
    schoolId = +schoolId;
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID]
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
    const curTime = moment().startOf('day').unix();
    let {value: needSignInTimes} = await PreferenceController.GetValueByName(schoolId, 'SIGNIN_DAILY_TIMES');
    needSignInTimes = +needSignInTimes;
    if (!checkConvertedNumberValid(needSignInTimes, true)) {
      return ecode2.HEALTH_INVALID_SIGNIN_TIMES;
    }
    const signInModel = await models.healthySignIn.findOne({where: {uid: userId, signInAt: curTime}, attributes: ['count']});
    const curSignInTimes = signInModel ? signInModel.getDataValue('count') : 0;
    return {...ecode2.SUCCESS, signInStatus: {cur: curSignInTimes, total: needSignInTimes}};
  }
  /**
   * 获取指定用户在指定年份和月份的打卡情况列表
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} year 指定年份
   * @param {number} month 指定月份
   * @returns {{code: number, msg: string, signInStatuses: {cur: number, total: number}[]}} 执行结果，错误信息，打卡情况列表
   */
  static async GetSignInStatusesByDate(userId, schoolId, year, month) {
    userId = +userId;
    schoolId = +schoolId;
    year = +year;
    month = +month;
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [year, [validationRules.greaterThan, 0], ecode.TIME_INVALID_YEAR],
      [month, [validationRules.between, 1, 12], ecode.TIME_INVALID_MONTH]
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
    const queryMoment = moment([year, month - 1, 1]);
    const days = queryMoment.daysInMonth();
    if (moment().isBefore(queryMoment)) {
      return ecode2.HEALTH_TIME_IS_FUTURE;
    }
    let {value: needSignInTimes} = await PreferenceController.GetValueByName(schoolId, 'SIGNIN_DAILY_TIMES');
    needSignInTimes = +needSignInTimes;
    if (!checkConvertedNumberValid(needSignInTimes, true)) {
      return ecode2.HEALTH_INVALID_SIGNIN_TIMES;
    }
    const startTimestamp = queryMoment.startOf('month').unix(), endTimestamp = queryMoment.endOf('month').unix();
    const statuses = await models.healthySignIn.findAll({where: {uid: userId, signInAt: {[gte]: startTimestamp, [lte]: endTimestamp}}, order: [['signInAt', 'ASC']]});
    const signInStatuses = [];
    for (let i = 0; i < days; i++) {
      const status = {cur: 0, total: needSignInTimes};
      if (statuses && statuses[i]) {
        status.cur = statuses[i].getDataValue('count');
      }
      signInStatuses.push(status);
    }
    return {...ecode2.SUCCESS, signInStatuses};
  }
}
module.exports = HealthController;