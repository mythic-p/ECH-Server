// 这里主要存放工具类函数
module.exports = {
  /**
   * 检测一个从其他类型转换而来的数字，是否可用
   * @param {Number} num 从其他类型转换来的整数
   * @param {Boolean} positive 该数字是否必须是正数
   * @returns {Boolean} 如果检测通过，则true，否则false
   */
  checkConvertedNumberValid(num, positive) {
    return !isNaN(num) && (positive === true ? num > 0 : true);
  },
  /**
   * 获取合法排序代号数组
   */
  getValidOrder() {
    return [1, 2, 3, 4];
  },
  /**
   * 将给定的排序规则序号转换成Sequelize需要的排序数组
   * @param {Number} order 排序规则的序号
   */
  convertOrderToArray(order) {
    switch (order) {
      case 1:
        return [['createdAt', 'DESC']];
      case 2:
        return [['createdAt', 'ASC']];
      case 3:
        return [['updatedAt', 'DESC']];
      case 4:
        return [['updatedAt', 'ASC']];
      default:
        return [[]];
    }
  },
  /**
   * 常用错误代码 数组表示 第一个元素是错误代码 第二个元素是错误描述
   */
  ecode: {
    USER_INVALID_ID: [10000, '用户ID非法'],
    USER_INVALID_USERNAME: [10002, '用户名非法'],
    USER_INVALID_PASSWORD: [10003, '密码非法'],
    USER_INVALID_AVATAR_URL: [10006, '头像URL非法'],
    SCHOOL_INVALID_ID: [11002, '学校ID非法'],
    ARTICLE_EMPTY_TITLE: [10501, '文章标题不能为空'],
    ARTICLE_EMPTY_DESC: [10502, '文章简介不能为空'],
    ARTICLE_EMPTY_CONTENT: [10503, '文章内容不能为空'],
    ARTICLE_INVALID_AVAILABILITY: [10504, '文章访问权限非法'],
    ARTICLE_INVALID_CATEGORY_ID: [10505, '文章类别非法'],
    ARTICLE_TITLE_TOO_LONG: [10506, '文章标题过长'],
    ARTICLE_DESC_TOO_LONG: [10507, '文章简介过长'],
    ARTICLE_CONTENT_TOO_LONG: [10508, '文章内容过长'],
    ARTICLE_INVALID_ID: [10509, '文章ID非法'],
    ARTICLE_COMMENT_CONTENT_EMPTY: [10510, '评论不能为空'],
    ARTICLE_COMMENT_CONTENT_TOO_LONG: [10519, '评论内容过长'],
    ARTICLE_COMMENT_INVALID_ID: [10520, '评论ID非法'],
    ANNOUNCEMENT_INVALID_CONTENT: [13001, '公告内容非法'],
    BATHHOUSE_INVALID_ID: [11504, '澡堂ID非法'],
    BATHHOUSE_INVALID_NAME: [11501, '澡堂名称非法'],
    BATHHOUSE_INVALID_CODE: [11502, '订单代号非法'],
    BATHHOUSE_SEAT_INVALID_CODE: [11505, '座位编号非法'],
    BATHHOUSE_INVALID_APPOINTMENT_ID: [11510, '预约ID非法'],
    CANTEEN_INVALID_ID: [12001, '食堂ID非法'],
    CANTEEN_INVALID_CATEGORY_ID: [12004, '类别ID非法'],
    CANTEEN_INVALID_TABLE_ID: [12005, '餐桌ID非法'],
    CANTEEN_INVALID_APPOINTMENT_TYPE: [12007, '预约类型非法'],
    CANTEEN_INVALID_GOODS_LIST: [12008, '菜品列表非法'],
    CANTEEN_INVALID_SEAT_ID: [12009, '座位ID非法'],
    CANTEEN_INVALID_APPOINTMENT_ID: [12015, '预约ID非法'],
    CANTEEN_INVALID_NAME: [12017, '食堂名称非法'],
    CANTEEN_INVALID_CODE: [12018, '食堂订单代号非法'],
    CANTEEN_INVALID_CATEGORY_NAME: [12019, '类别名称非法'],
    CANTEEN_INVALID_TABLE_CODE: [12024, '餐桌名称非法'],
    CANTEEN_INVALID_SEATS_INFO: [12025, '座位信息非法'],
    HEALTH_INVALID_TEMPERATURE: [14001, '登记体温非法'],
    LEAVE_INVALID_LEAVE_BACK_TIME: [12501, '离校时间不得晚于返校时间'],
    LEAVE_INVALID_LEAVE_REASON: [12502, '离校原因非法'],
    LEAVE_INVALID_SIGNATURE_URL: [12503, '签名图片URL非法'],
    LEAVE_INVALID_APPLICATION_ID: [12504, '申请ID非法'],
    LEAVE_INVALID_REPLY_TYPE: [12506, '审批结果非法'],
    LEAVE_INVALID_REJECT_REASON: [12507, '驳回理由非法'],
    UPDATE_EMPTY_FIELDS: [13001, '增量更新字段不能为空'],
    PAGINATION_INVALID_PAGE: [13002, '页数非法'],
    PAGINATION_INVALID_SIZE: [13003, '大小非法'],
    PREFERENCE_INVALID_NAME: [13013, '偏好设置名称非法'],
    PREFERENCE_INVALID_VALUE: [13015, '偏好设置内容非法'],
    SCHOOL_INVALID_NAME: [11003, '学校名称非法'],
    SORT_INVALID_ORDER: [13004, '排序规则非法'],
    BEGIN_TIME_INVALID: [13006, '起始时间非法'],
    END_TIME_INVALID: [13007, '终止时间非法'],
    INVALID_BEGIN_END_TIME: [13008, '始末时间逻辑错误'],
    TIME_INVALID_YEAR: [13009, '年份非法'],
    TIME_INVALID_MONTH: [13010, '月份非法'],
    GEO_INVALID_LATITUDE: [13011, '纬度非法'],
    GEO_INVALID_LONGITUDE: [13012, '经度非法']
  },
  /**
   * 常用错误代码 对象表示 code表示错误代码 msg表示错误描述
   */
  ecode2: {
    SUCCESS: {code: 200, msg: ''},
    USER_NOT_EXISTS: {code: 10001, msg: '用户不存在'},
    USER_SAME_USERNAME: {code: 10004, msg: '用户已存在'},
    USER_INCORRECT_PASSWORD: {code: 10005, msg: '密码错误'},
    SCHOOL_NOT_EXISTS: {code: 11001, msg: '学校不存在'},
    SCHOOL_SAME_NAME: {code: 11004, msg: '学校重名'},
    ARTICLE_SAME_TITLE: {code: 10511, msg: '同标题文章已存在'},
    ARTICLE_NOT_EXISTS: {code: 10512, msg: '文章不存在'},
    ARTICLE_INVALID_CANCEL_LIKE: {code: 10513, msg: '取消点赞操作非法'},
    ARTICLE_REPEAT_CANCEL_LIKE: {code: 10514, msg: '已取消该文章的点赞，不可重复操作'},
    ARTICLE_REPEAT_LIKE: {code: 10515, msg: '已点赞过该文章，不可重复操作'},
    ARTICLE_INVALID_CANCEL_FAVORITE: {code: 10516, msg: '取消收藏操作非法'},
    ARTICLE_REPEAT_CANCEL_FAVORITE: {code: 10517, msg: '当前文章已取消收藏，不可重复操作'},
    ARTICLE_REPEAT_FAVORITE: {code: 10518, msg: '当前文章已被收藏，不可重复操作'},
    ARTICLE_COMMENT_NOT_EXISTS: {code: 10521, msg: '评论不存在'},
    BATHHOUSE_SAME_NAME_OR_CODE: {code: 11503, msg: '澡堂名称或订单代号重名'},
    BATHHOUSE_NOT_EXISTS: {code: 11506, msg: '澡堂不存在'},
    BATHHOUSE_SEAT_SAME_CODE: {code: 11507, msg: '座位编号重名'},
    BATHHOUSE_SEAT_NOT_EXISTS: {code: 11508, msg: '淋浴位不存在'},
    BATHHOUSE_SEAT_IS_USED: {code: 11509, msg: '该淋浴位在时间段内已被预约'},
    BATHHOUSE_APPOINTMENT_NOT_EXISTS: {code: 11511, msg: '预约申请不存在，取消失败'},
    CANTEEN_NOT_EXISTS: {code: 12002, msg: '食堂不存在'},
    CANTEEN_CATEGORY_NOT_EXISTS: {code: 12003, msg: '类别不存在'},
    CANTEEN_TABLE_NOT_EXISTS: {code: 12006, msg: '餐桌不存在'},
    CANTEEN_SEAT_NOT_EXISTS: {code: 12010, msg: '座位不存在'},
    CANTEEN_SEAT_IS_USED: {code: 12011, msg: '该座位在当前时间段正在被占用'},
    CANTEEN_INVALID_GOODS_FORMAT: {code: 12012, msg: '菜品格式错误'},
    CANTEEN_INVALID_GOODS_AMOUNT: {code: 12013, msg: '数量非法'},
    CANTEEN_GOOD_NOT_EXISTS: {code: 12014, msg: '菜品不存在'},
    CANTEEN_SAME_NAME_OR_CODE: {code: 12016, msg: '食堂名称或订单代号重名'},
    CANTEEN_SAME_CATEGORY_NAME: {code: 12020, msg: '同名类别已存在'},
    CANTEEN_GOODS_INVALID_NAME: {code: 12021, msg: '菜品名称非法'},
    CANTEEN_GOODS_INVALID_PICTURE: {code: 12022, msg: '菜品展示图片不能为空'},
    CANTEEN_GOODS_SAME_NAME: {code: 12023, msg: '菜品名称重名'},
    CANTEEN_SAME_TABLE_NAME: {code: 12026, msg: '餐桌名称重名'},
    CANTEEN_SEATS_LIMIT: {code: 12027, msg: '同一个方向的座位不得超过3个'},
    HEALTH_INVALID_GEO_LOCATION: {code: 14002, msg: '地理位置非法'},
    HEALTH_INVALID_GEO_DATA_FORMAT: {code: 14003, msg: '地理位置格式错误'},
    HEALTH_INVALID_SIGNIN_TIMES: {code: 14004, msg: '每日打卡次数非法，请联系校方管理员根据规定修改打卡次数'},
    HEALTH_INVALID_SIGNIN_INTERVAL: {code: 14005, msg: '打卡时限非法，请联系校方管理员根据规定修改打卡时限'},
    HEALTH_FULL_SIGNIN: {code: 14006, msg: '本日打卡次数已满'},
    HEALTH_SIGNIN_NOT_AVAILABLE: {code: 14007, msg: '不在打卡时间段内，无法打卡'},
    HEALTH_SIGNIN_HAS_DONE: {code: 14008, msg: '该时间段已打过卡'},
    HEALTH_TIME_IS_FUTURE: {code: 14009, msg: '无法获取未来时间的打卡情况'},
    LEAVE_APPLICATION_NOT_EXISTS: {code: 12505, msg: '申请不存在'},
    LEAVE_HAS_REPLIED: {code: 12508, msg: '已经进行过审批了'},
    LEAVE_CAN_NOT_WITHDRAW: {code: 12509, msg: '申请审批已结束，无法撤回'},
    LEAVE_INVALID_JUDGE_STAGES: {code: 12510, msg: '审核阶段错误，请联系校方管理员'},
    LEAVE_INVALID_JUDGER_NUMBER: {code: 12511, msg: '审核人数量错误，请联系校方管理员'},
    PREFERENCE_NOT_EXISTS: {code: 13014, msg: '偏好配置不存在'},
    UPDATE_FIELDS_INVALID_FORMAT: {code: 13005, msg: '更新字段格式非法'}
  }
}