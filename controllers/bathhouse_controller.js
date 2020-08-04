const models = require('../models');
const {checkConvertedNumberValid, getValidOrder, convertOrderToArray, ecode, ecode2} = require('../utils');
const {Validator, validationRules} = require('../utils/validator');
const {momentRules} = require('../utils/moment-rules');
const {or, gte, lte, not} = require('sequelize').Op;
const moment = require('moment');

class BathhouseController {
  /**
   * 获取指定学校的澡堂列表
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, bathhouses: {id: number, name: string, code: string}[]}} {code, msg, bathhouses} 执行结果，错误信息，澡堂列表
   */
  static async GetBathhousesById(schoolId) {
    schoolId = +schoolId;
    const checkRules = [
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
    const bathhouses = await models.bathhouses.findAll({where: {sid: schoolId}, attributes: ['id', 'name', 'code']});
    return {...ecode2.SUCCESS, bathhouses};
  }
  /**
   * 向指定学校添加一个澡堂
   * @param {number} schoolId 学校ID
   * @param {string} name 澡堂名称
   * @param {string} code 澡堂订单代号
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddBathhouseById(schoolId, name, code) {
    schoolId = +schoolId;
    code = code.trim();
    const checkRules = [
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name.length, [validationRules.between, 1, 30], ecode.BATHHOUSE_INVALID_NAME],
      [code.length, [validationRules.equal, 3], ecode.BATHHOUSE_INVALID_CODE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const namingExists = (await models.bathhouses.count({where: {sid: schoolId, [or]: [{name}, {code}]}})) >= 1;
    if (namingExists) {
      return ecode2.BATHHOUSE_SAME_NAME_OR_CODE;
    }
    const pkName = `bathhouse_${schoolId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.bathhouses.create({id: pkModel.getDataValue('count'), sid: schoolId, name, code});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 为指定学校的指定澡堂添加一个淋浴位
   * @param {number} bathhouseId 澡堂ID
   * @param {number} schoolId 学校ID
   * @param {string} code 淋浴位编号
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddBathhouseSeatById(bathhouseId, schoolId, code) {
    bathhouseId = +bathhouseId;
    schoolId = +schoolId;
    code = code.trim();
    const checkRules = [
      [bathhouseId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [code.length, [validationRules.between, 1, 8], ecode.BATHHOUSE_SEAT_INVALID_CODE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    const namingExists = (await models.bathhouseSeats.count({where: {code, sid: schoolId}})) >= 1;
    if (namingExists) {
      return ecode2.BATHHOUSE_SEAT_SAME_CODE;
    }
    const pkName = `bathhouse_seat_${schoolId}_${bathhouseId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.bathhouseSeats.create({id: pkModel.getDataValue('count'), sid: schoolId, bid: bathhouseId, code});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定学校的指定澡堂的淋浴位在时间段内的信息和使用情况
   * @param {number} bathhouseId 澡堂ID
   * @param {number} schoolId 学校ID
   * @param {string} beginTime 起始搜索时间
   * @param {string} endTime 终止搜索时间
   * @param {number} userId 用户ID
   * @returns {{code: number, msg: string, seats: {isUsed: boolean, my: boolean, id: number, code: string}[]}} {code, msg, seats} 执行结果，错误信息，淋浴位列表
   */
  static async GetBathhouseSeatsById(bathhouseId, schoolId, beginTime, endTime, userId) {
    bathhouseId = +bathhouseId;
    schoolId = +schoolId;
    beginTime = moment(beginTime);
    endTime = moment(endTime);
    userId = +userId;
    const checkRules = [
      [bathhouseId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID]
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [beginTime, [momentRules.isValid], ecode.BEGIN_TIME_INVALID],
      [endTime, [momentRules.isValid], ecode.END_TIME_INVALID],
      [beginTime, [momentRules.isAfter, endTime], ecode.INVALID_BEGIN_END_TIME]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    beginTime = beginTime.unix();
    endTime = endTime.unix();
    const seats = await models.bathhouseSeats.findAll({where: {bid: bathhouseId, sid: schoolId}, attributes: ['code', 'id']});
    const newSeats = [];
    for (let i = 0; i < seats.length; i++) {
      const appointmentModel = await models.bathhouseAppointments.findOne({
        where: {
          sid: schoolId,
          bid: bathhouseId,
          seat: seats[i].getDataValue('id'),
          [not]: {
            [or]: [{beginTime: {[gte]: endTime}}, {endTime: {[lte]: beginTime}}]
          },
          status: 1
        },
        attributes: ['uid']
      });
      const isUsed = !!appointmentModel, my = appointmentModel ? userId === appointmentModel.getDataValue('uid') : false;
      newSeats.push({isUsed, my, ...seats[i].toJSON()});
    }
    return {...ecode2.SUCCESS, seats: newSeats};
  }
  /**
   * 指定用户向指定学校的指定澡堂添加一个淋浴预约
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} bathhouseId 澡堂ID
   * @param {number} seatId 淋浴位ID
   * @param {number} beginTime 洗浴起始时间
   * @param {number} endTime 洗浴结束时间
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddAppointment(userId, schoolId, bathhouseId, seatId, beginTime, endTime) {
    userId = +userId;
    schoolId = +schoolId;
    bathhouseId = +bathhouseId;
    seatId = +seatId;
    beginTime = moment(beginTime);
    endTime = moment(endTime);
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [bathhouseId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID],
      [seatId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_SEAT_INVALID_CODE],
      [beginTime, [momentRules.isValid], ecode.BEGIN_TIME_INVALID],
      [endTime, [momentRules.isValid], ecode.END_TIME_INVALID],
      [beginTime, [momentRules.isAfter, endTime], ecode.INVALID_BEGIN_END_TIME]
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
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    const seatExists = (await models.bathhouseSeats.count({where: {id: seatId, sid: schoolId, bid: bathhouseId}})) >= 1;
    if (!seatExists) {
      return ecode2.BATHHOUSE_SEAT_NOT_EXISTS;
    }
    beginTime = beginTime.unix();
    endTime = endTime.unix();
    const isUsed = (await models.bathhouseAppointments.count({where: {
      sid: schoolId,
      bid: bathhouseId,
      seat: seatId,
      [not]: {
        [or]: [{beginTime: {[gte]: endTime}}, {endTime: {[lte]: beginTime}}]
      },
      status: 1
    }})) >= 1;
    if (isUsed) {
      return ecode2.BATHHOUSE_SEAT_IS_USED;
    }
    const pkName = `bathhouse_order_${schoolId}_${bathhouseId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.bathhouseAppointments.create({id: pkModel.getDataValue('count'), uid: userId, sid: schoolId, bid: bathhouseId, seat: seatId, beginTime, endTime, status: 1});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定预约的详情
   * @param {number} appointmentId 预约ID
   * @param {number} schoolId 学校ID
   * @param {number} bathhouseId 澡堂ID
   * @returns {{code: number, msg: string, appointment: {uid: number, seat: number, beginTime: number, endTime: number, status: number}}} 执行结果，错误信息，预约详情
   */
  static async GetAppointmentById(appointmentId, schoolId, bathhouseId) {
    appointmentId = +appointmentId;
    schoolId = +schoolId;
    bathhouseId = +bathhouseId;
    const checkRules = [
      [appointmentId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_APPOINTMENT_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [bathhouseIdm, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    const appointment = await models.bathhouseAppointments.findOne({where: {id: appointmentId, sid: schoolId, bid: bathhouseId}, attributes: ['uid', 'seat', 'beginTime', 'endTime', 'status']});
    return {...ecode2.SUCCESS, appointment};
  }
  /**
   * 获取指定用户在指定澡堂的预约列表
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} order 排序规则
   * @param {number} page 页码
   * @param {number} size 大小
   * @param {number} status 预约澡堂
   * @returns {{code: number, msg: string, appointments: {id: number, bid: number, seat: number, beginTime: number, endTime: number, status: number}[]}} 执行结果，错误信息，预约列表
   */
  static async GetAppointmentsById(userId, schoolId, order, page, size, status) {
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
    const appointments = await models.bathhouseAppointments.findAll({
      where: {uid: userId, sid: schoolId, ...other},
      offset: (page - 1) * size,
      limit: size,
      order,
      attributes: ['id', 'seat', 'beginTime', 'endTime', 'status', 'bid']
    });
    return {...ecode2.SUCCESS, appointments};
  }
  /**
   * 通过指定的学校，澡堂和预约时间段，取消指定的预约
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} bathhouseId 澡堂ID
   * @param {string} beginTime 预约起始时间的字符串
   * @param {string} endTime 预约结束时间的字符串
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async CancelAppointmentByTime(userId, schoolId, bathhouseId, beginTime, endTime) {
    userId = +userId;
    schoolId = +schoolId;
    bathhouseId = +bathhouseId;
    beginTime = moment(beginTime);
    endTime = moment(endTime);
    const checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [bathhouseId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID],
      [beginTime, [momentRules.isValid], ecode.BEGIN_TIME_INVALID],
      [endTime, [momentRules.isValid], ecode.END_TIME_INVALID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    beginTime = beginTime.unix();
    endTime = endTime.unix();
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    const appointmentExists = (await models.bathhouseAppointments.count({where: {sid: schoolId, uid: userId, bid: bathhouseId, beginTime, endTime, status: 1}})) >= 1;
    if (!appointmentExists) {
      return ecode2.BATHHOUSE_APPOINTMENT_NOT_EXISTS;
    }
    await models.bathhouseAppointments.update({status: 4}, {where: {sid: schoolId, uid: userId, bid: bathhouseId, beginTime, endTime, status: 1}});
    return ecode2.SUCCESS;
  }
  /**
   * 通过指定的学校，澡堂，取消被指定ID的预约
   * @param {number} appointmentId 预约ID
   * @param {number} schoolId 学校ID
   * @param {number} bathhouseId 澡堂ID
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async CancelAppointmentById(appointmentId, schoolId, bathhouseId) {
    appointmentId = +appointmentId;
    schoolId = +schoolId;
    bathhouseId = +bathhouseId;
    const checkRules = [
      [appointmentId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_APPOINTMENT_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [bathhouseId, [validationRules.greaterThan, 0], ecode.BATHHOUSE_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const bathhouseExists = (await models.bathhouses.count({where: {id: bathhouseId, sid: schoolId}})) >= 1;
    if (!bathhouseExists) {
      return ecode2.BATHHOUSE_NOT_EXISTS;
    }
    const appointmentExists = (await models.bathhouseAppointments.count({where: {id: appointmentId, sid: schoolId, bid: bathhouseId, status: 1}})) >= 1;
    if (!appointmentExists) {
      return ecode2.BATHHOUSE_APPOINTMENT_NOT_EXISTS;
    }
    await models.bathhouseAppointments.update({status: 4}, {where: {id: appointmentId, sid: schoolId, bid: bathhouseId, status: 1}});
    return ecode2.SUCCESS;
  }
}
module.exports = BathhouseController;