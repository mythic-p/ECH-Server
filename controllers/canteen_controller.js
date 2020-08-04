const moment = require('moment');
const models = require('../models');
const {checkConvertedNumberValid, convertOrderToArray, ecode, ecode2, getValidOrder} = require('../utils');
const {Validator, validationRules} = require('../utils/validator');
const {momentRules} = require('../utils/moment-rules');
const {gte, lte, or, not} = require('sequelize').Op;
/**
 * 获取合法的食堂预约类型
 */
const getValidAppointmentType = () => [1, 2, 3];
/**
 * 食堂预约控制器
 */
class CanteenController {
  /**
   * 获取指定学校的食堂列表
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, canteens: {id: number, name: string}[]}} 显示结果，错误信息，食堂列表
   */
  static async GetCanteensById(schoolId) {
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
    const canteens = await models.canteens.findAll({where: {sid: schoolId}, attributes: ['id', 'name']});
    return {...ecode2.SUCCESS, canteens};
  }
  /**
   * 获取指定学校的指定食堂的信息
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, canteen: {name: string, code: string}}} 执行结果，错误信息，食堂信息
   */
  static async GetCanteenById(canteenId, schoolId) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
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
    const canteen = await models.canteens.findOne({where: {id: canteenId, sid: schoolId}, attributes: ['name', 'code']});
    return {...ecode2.SUCCESS, canteen};
  }
  /**
   * 获取指定食堂的菜品分类
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, categories: {id: number, name: string}[]}} 执行结果，错误信息，菜品分类列表
   */
  static async GetCanteenCategoriesById(canteenId, schoolId) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
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
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const categories = await models.canteenCategories.findAll({where: {cid: canteenId, sid: schoolId}, attributes: ['id', 'name']});
    return {...ecode2.SUCCESS, categories};
  }
  /**
   * 获取指定食堂的指定类别的菜品列表
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {number} categoryId 类别ID
   * @returns {{code: number, msg: string, items: {id: number, name: string, price: number, image: string}[]}} 执行结果，错误信息，菜品列表
   */
  static async GetCanteenMenuById(canteenId, schoolId, categoryId) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    categoryId = +categoryId;
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [categoryExists, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_CATEGORY_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const categoryExists = (await models.canteenCategories.count({where: {id: categoryId, sid: schoolId, cid: canteenId}})) >= 1;
    if (!categoryExists) {
      return ecode2.CANTEEN_CATEGORY_NOT_EXISTS;
    }
    const items = await models.canteenItems.findAll({where: {cid: canteenId, sid: schoolId, category: categoryId}, attributes: ['id', 'name', 'price', 'image']});
    return {...ecode2.SUCCESS, items};
  }
  /**
   * 搜索指定时间段内餐桌的预约情况
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {number} beginTime 起始时间
   * @param {number} endTime 终止时间
   * @returns {{code: number, msg: string, data: {beginTime: number, tables: {id: number, code: string, seatsNum: number}[]}}} 执行结果，错误信息，餐桌信息列表和附加信息
   */
  static async GetCanteenTablesById(canteenId, schoolId, beginTime, endTime) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    beginTime = moment(beginTime);
    endTime = moment(endTime);
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
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
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    beginTime = moment.max(beginTime, moment()).unix();
    endTime = endTime.unix();
    const tables = await models.canteenTables.findAll({where: {sid: schoolId, cid: canteenId}, attributes: ['id', 'code', 'seatsNum']});
    const newTables = [];
    for (let i = 0; i < tables.length; i++) {
      const seatsNum = tables[i].getDataValue('seatsNum');
      const chairUsedNum = await models.canteenAppointments.count({
        where: {
          cid: canteenId,
          sid: schoolId,
          [not]: {
            [or]: [{beginTime: {[gte]: endTime}}, {endTime: {[lte]: beginTime}}]
          },
          type: 1,
          table: tables[i].getDataValue('id'),
          status: 10
        }
      });
      const tableStatus = chairUsedNum === seatsNum ? 1 : chairUsedNum === 0 ? 3 : 2;
      newTables.push({status: tableStatus, ...tables[i].toJSON()});
    }
    return {...ecode2.SUCCESS, data: {beginTime, tables: newTables}};
  }
  /**
   * 获取指定食堂的指定餐桌的椅子信息
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {number} tableId 餐桌ID
   * @param {number} beginTime 起始时间
   * @param {number} endTime 结束时间
   * @returns {{code: number, msg: string, chairs: {id: number, dir: string}[]}} 执行结果，错误信息，椅子信息列表
   */
  static async GetCanteenTableChairsById(canteenId, schoolId, tableId, beginTime, endTime) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    tableId = +tableId;
    beginTime = moment(beginTime);
    endTime = moment(endTime);
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [tableId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_TABLE_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const tableExists = (await models.canteenTables.count({where: {id: tableId, cid: canteenId, sid: schoolId}})) >= 1;
    if (!tableExists) {
      return ecode2.CANTEEN_TABLE_NOT_EXISTS;
    }
    beginTime = beginTime.unix();
    endTime = endTime.unix();
    const chairs = await models.canteenSeats.findAll({where: {tid: tableId, sid: schoolId, cid: canteenId}, attributes: ['id', 'dir']});
    const newChairs = [];
    for (let i = 0; i < chairs.length; i++) {
      const isUsed = await models.canteenAppointments.count({where: {
        table: tableId,
        cid: canteenId,
        sid: schoolId,
        seat: chairs[i].getDataValue('id'),
        [not]: {[or]: [{beginTime: {[gte]: endTime}}, {endTime: {[lte]: beginTime}}]},
        type: 1,
        status: 10
      }}) >= 1;
      newChairs.push({isUsed, ...chairs[i].toJSON()});
    }
    return {...ecode2.SUCCESS, chairs: newChairs};
  }
  /**
   * 添加一个食堂预约
   * @param {number} userId 用户ID
   * @param {number} schoolId 学校ID
   * @param {number} canteenId 食堂ID
   * @param {number} type 预约类型
   * @param {string} items 预约选购的菜品
   * @param {number} beginTime 预约开始时间
   * @param {number} endTime 预约结束时间，只有堂食有效
   * @param {number} seatId 椅子的ID，只有堂食有效
   * @param {number} tableId 餐桌的ID，只有堂食有效
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddAppointment(userId, schoolId, canteenId, type, items, beginTime, endTime, seatId, tableId) {
    userId = +userId;
    schoolId = +schoolId;
    canteenId = +canteenId;
    type = +type;
    seatId = +seatId;
    tableId = +tableId;
    items = items.trim();
    beginTime = moment(beginTime);
    let checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolIdd, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [type, [validationRules.include, getValidAppointmentType()], ecode.CANTEEN_INVALID_APPOINTMENT_TYPE],
      [items, [validationRules.regexTest, /\d+\|/], ecode.CANTEEN_INVALID_GOODS_LIST],
      [beginTime, [momentRules.isValid], ecode.BEGIN_TIME_INVALID]
    ];
    if (type === 1) {
      endTime = moment(endTime);
      const extraRules = [
        [seatId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_SEAT_ID],
        [tableId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_TABLE_ID],
        [endTime, [momentRules.isValid], ecode.END_TIME_INVALID],
        [beginTime, [momentRules.isAfter, endTime], ecode.INVALID_BEGIN_END_TIME]
      ];
      checkRules = checkRules.concat(extraRules);
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
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    beginTime = beginTime.unix();
    if (type === 1) {
      const tableExists = (await models.canteenTables.count({where: {id: tableId, cid: canteenId, sid: schoolId}})) >= 1;
      if (!tableExists) {
        return ecode2.CANTEEN_TABLE_NOT_EXISTS;
      }
      const seatExists = (await models.canteenSeats.count({where: {id: seatId, tid: tableId, sid: schoolId, cid: canteenId}})) >= 1;
      if (!seatExists) {
        return ecode2.CANTEEN_SEAT_NOT_EXISTS;
      }
      endTime = endTime.unix();
      const isUsed = (await models.canteenAppointments.count({where: {
        type: 1,
        [not]: {[or]: [{beginTime: {[gte]: endTime}}, {endTime: {[lte]: beginTime}}]},
        table: tableId,
        sid: schoolId,
        cid: canteenId,
        seat: seatId,
        status: 10
      }})) >= 1;
      if (isUsed) {
        return ecode2.CANTEEN_SEAT_IS_USED;
      }
    }
    let price = 0;
    const itemsStr = items;
    items = items.split('|');
    for (let i = 0; i < items.length; i++) {
      if (items[i] === '' || !items[i]) {
        continue;
      }
      const item = items[i].split(',');
      if (item.length !== 3) {
        return ecode2.CANTEEN_INVALID_GOODS_FORMAT;
      }
      const amount = parseInt(item[1]);
      if (!checkConvertedNumberValid(amount, true)) {
        return ecode2.CANTEEN_INVALID_GOODS_AMOUNT;
      }
      const category = parseInt(item[2]);
      const itemModel = await models.canteenItems.findOne({where: {id: item[0], category, cid: canteenId, sid: schoolId}, attributes: ['price']});
      if (!itemModel) {
        return ecode2.CANTEEN_GOOD_NOT_EXISTS;
      }
      price += itemModel.getDataValue('price') * amount;
    }
    const pkName = `canteen_order_${schoolId}_${canteenId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.canteenAppointments.create({
      id: pkModel.getDataValue('count'),
      uid: userId,
      cid: canteenId,
      sid: schoolId,
      beginTime: beginTime,
      endTime: type === 1 ? endTime : null,
      type,
      items: itemsStr,
      price,
      status: 2,
      seat: type === 1 ? seatId : null,
      table: type === 1 ? tableId : null
    });
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 通过指定ID获取预约订单的详情
   * @param {number} appointmentId 预约单号ID
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @returns {{code: number, msg: string, appointment: {uid: number, beginTime: number, endTime?: number, type: number, items: string, price: number, status: number, seat?: number, table?: number}}} 执行结果，错误信息，预约详情
   */
  static async GetAppointmentById(appointmentId, canteenId, schoolId) {
    appointmentId = +appointmentId;
    canteenId = +canteenId;
    schoolId = +schoolId;
    const checkRules = [
      [appointmentId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_APPOINTMENT_ID],
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
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
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const appointment = await models.canteenAppointments.findOne({where: {id: appointmentId, cid: canteenId, sid: schoolId}, attributes: {exclude: ['_id', 'id', 'cid', 'sid', 'createdAt', 'updatedAt']}});
    return {...ecode2.SUCCESS, appointment};
  }
  /**
   * 获取指定用户一定数量的预约详情
   * @param {number} userId 用户ID
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {number} order 排序规则编号
   * @param {number} page 页码
   * @param {number} size 大小
   * @param {number} status 预约状态
   * @param {number} begin [可选] 查找的起始时间
   * @param {number} end [可选] 若填写了begin，则end必填 查找的结束时间
   * @returns {{code: number, msg: string, appointments: {id: number, beginTime: number, endTime?: number, type: number, items: string, price: number, status: number, seat?: number, table?: number}[]}} 执行结果，错误信息，预约列表
   */
  static async GetAppointmentsById(userId, schoolId, order, page, size, status, begin, end) {
    userId = +userId;
    schoolId = +schoolId;
    order = +order;
    page = +page || 1;
    size = +size || 5;
    status = +status;
    if (begin && begin !== '') {
      begin = moment(begin);
    }
    if (end && end !== '') {
      end = moment(end);
    }
    let checkRules = [
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [order, [validationRules.include, getValidOrder()], ecode.SORT_INVALID_ORDER],
      [page, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_PAGE],
      [size, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_SIZE]
    ];
    if (begin) {
      const extraRules = [
        [begin, [momentRules.isValid], ecode.BEGIN_TIME_INVALID],
        [end, [momentRules.isValid], ecode.END_TIME_INVALID],
        [begin, [momentRules.isAfter, end], ecode.INVALID_BEGIN_END_TIME]
      ];
      checkRules = checkRules.concat(extraRules);
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
    order = convertOrderToArray(order);
    let time = {}, other = {};
    if (checkConvertedNumberValid(status, true)) {
      other = {status};
    }
    if (begin && begin.isValid()) {
      begin = begin.unix();
      end = end.unix();
      time = {
        [not]: {
          [or]: [{begin: {[gte]: end}}, {end: {[lte]: begin}}]
        }
      };
    }
    const appointments = await models.canteenAppointments.findAll({
      where: {uid: userId, sid: schoolId, ...other, ...time},
      offset: (page - 1) * size,
      limit: size,
      order,
      attributes: {exclude: ['_id', 'uid', 'sid', 'createdAt', 'updatedAt']}
    });
    return {...ecode2.SUCCESS, appointments};
  }
  /**
   * 添加一个新的食堂
   * @param {number} schoolId 学校ID
   * @param {string} name 食堂名称
   * @param {string} code 订单代号
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddCanteen(schoolId, name, code) {
    schoolId = +schoolId;
    name = name.trim();
    code = code.trim();
    const checkRules = [
      [schoolIdd, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name.length, [validationRules.between, 1, 20], ecode.CANTEEN_INVALID_NAME],
      [code, [validationRules.regexTest, /^[A-Z]{5}$/], ecode.CANTEEN_INVALID_CODE]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const namingExists = (await models.canteens.count({where: {sid: schoolId, [or]: [{name}, {code}]}})) >= 1;
    if (namingExists) {
      return ecode2.CANTEEN_SAME_NAME_OR_CODE;
    }
    const pkName = `canteen_${schoolId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.canteens.create({id: pkModel.getDataValue('count'), name, code, sid: schoolId});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 为指定的食堂创建一个菜品类别
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {string} name 类别名称
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddCanteenCategory(canteenId, schoolId, name) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    name = name.trim();
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [name.length, [validationRules.between, 1, 9], ecode.CANTEEN_INVALID_CATEGORY_NAME]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const namingExists = (await models.canteenCategories.count({where: {cid: canteenId, sid: schoolId, name}})) >= 1;
    if (namingExists) {
      return ecode2.CANTEEN_SAME_CATEGORY_NAME;
    }
    const pkName = `canteen_category_${schoolId}_${canteenId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    await models.canteenCategories.create({id: pkModel.getDataValue('count'), name, sid: schoolId, cid: canteenId});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 向指定食堂的指定类别添加一组菜品信息
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {number} categoryId 类别ID
   * @param {string} items 菜品列表
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddCanteenCategoryItems(canteenId, schoolId, categoryId, items) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    categoryId = +categoryId;
    items = items.trim();
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [categoryId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_CATEGORY_ID],
      [items.length, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_GOODS_LIST]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const categoryExists = (await models.canteenCategories.count({where: {id: categoryId, sid: schoolId, cid: canteenId}})) >= 1;
    if (!categoryExists) {
      return ecode2.CANTEEN_CATEGORY_NOT_EXISTS;
    }
    items = items.split('|');
    const newItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].split(',');
      if (item.length !== 3) {
        continue;
      } else if (item[0].trim().length < 1 || item[0].length > 20) {
        return ecode2.CANTEEN_GOODS_INVALID_NAME;
      } else if (item[2].trim().length < 1) {
        return ecode2.CANTEEN_GOODS_INVALID_PICTURE;
      }
      const namingExists = (await models.canteenItems.count({where: {cid: canteenId, sid: schoolId, category: categoryId, name: item[0]}})) >= 1;
      if (namingExists) {
        return ecode2.CANTEEN_GOODS_SAME_NAME;
      }
      newItems.push({name: item[0], price: item[1], image: item[2]});
    }
    const pkName = `canteen_item_${schoolId}_${canteenId}_${categoryId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    for (let i = 0; i < newItems.length; i++) {
      await models.canteenItems.create({id: pkModel.getDataValue('count'), name: newItems[i].name, price: newItems[i].price, cid: canteenId, sid: schoolId, category: categoryId, image: newItems[i].image});
      await pkModel.increment('count', {by: 1});
      pkModel.setDataValue('count', pkModel.getDataValue('count') + 1);
    }
    return ecode2.SUCCESS;
  }
  /**
   * 给指定的食堂添加一个餐桌和多个座位信息
   * @param {number} canteenId 食堂ID
   * @param {number} schoolId 学校ID
   * @param {string} code 餐桌代号
   * @param {string} seats 座位信息列表，|隔开
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddCanteenTable(canteenId, schoolId, code, seats) {
    canteenId = +canteenId;
    schoolId = +schoolId;
    code = code.trim();
    seats = seats.trim();
    const checkRules = [
      [canteenId, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_ID],
      [schoolId, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [code.length, [validationRules.between, 1, 9], ecode.CANTEEN_INVALID_TABLE_CODE],
      [seats.length, [validationRules.greaterThan, 0], ecode.CANTEEN_INVALID_SEATS_INFO]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const schoolExists = (await models.school.count({where: {id: schoolId}})) >= 1;
    if (!schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const canteenExists = (await models.canteens.count({where: {id: canteenId, sid: schoolId}})) >= 1;
    if (!canteenExists) {
      return ecode2.CANTEEN_NOT_EXISTS;
    }
    const namingExists = (await models.canteenTables.count({where: {sid: schoolId, cid: canteenId, code}})) >= 1;
    if (namingExists) {
      return ecode2.CANTEEN_SAME_TABLE_NAME;
    }
    seats = seats.split('|');
    const newSeats = [];
    const seatCount = {};
    for (let i = 0; i < seats.length; i++) {
      const seatDir = seats[i];
      if (seatCount[seatDir] && seatCount[seatDir] >= 3) {
        return ecode2.CANTEEN_SEATS_LIMIT;
      }
      newSeats.push({sid: schoolId, cid: canteenId, dir: seatDir});
      seatCount[seatDir] = seatCount[seatDir] ? seatCount[seatDir] + 1 : 1;
    }
    let pkName = `canteen_table_${schoolId}_${canteenId}`;
    const {'0': tablePKModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    const pkCount = tablePKModel.getDataValue('count');
    await models.canteenTables.create({id: pkCount, code, sid: schoolId, cid: canteenId});
    await tablePKModel.increment('count', {by: 1});
    pkName = `canteen_seat_${schoolId}_${canteenId}_${pkCount}`;
    const {'0': seatPKModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}});
    for (let i = 0; i < newSeats.length; i++) {
      await models.canteenSeats.create({id: seatPKModel.getDataValue('count'), tid: pkCount, ...newSeats[i]});
      await seatPKModel.increment('count', {by: 1});
      seatPKModel.setDataValue('count', seatPKModel.getDataValue('count') + 1);
    }
    await models.canteenTables.update({seatsNum: newSeats.length}, {where: {id: pkCount, sid: schoolId, cid: canteenId}});
    return ecode2.SUCCESS;
  }
}
module.exports = CanteenController;