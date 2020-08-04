// 如何编写表单校验规则
// [校验规则1, 校验规则2, ..., 校验规则n]
// 校验规则: [被校验的变量名称或字面量, 校验函数, 校验错误信息]
// 校验函数: [校验规则Symbol, 参数1, 参数2, ..., 参数n]
// 校验错误信息: [错误状态码, 错误提示内容]
// Validate([[variable, [ruleSymbol, param1, param2...], [400, '变量非法']]])
const validationRules = {
  isAlphabetic: Symbol('is_alphabetic'),// 被校验的数据是否是纯英文字母构成的字符串
  isCapitalizedAlphabetic: Symbol('is_capitalized_alphabetic'),// 被校验的数据是否由纯大写英文字母组成
  isUncapitalizedAlphabetic: Symbol('is_uncapitalized_alphabetic'),// 被校验的数据是否由纯小写英文字母组成
  onlyInteger: Symbol('only_integer'),// 被校验的数据是否是整数
  onlyReal: Symbol('only_real'),// 被校验的数据是否是实数，即带小数点
  isNumeric: Symbol('is_numeric'),// 被校验的数据是否是数字
  greaterThan: Symbol('greater_than'),// 被校验的数据是否大于参数1 一般是数字之间
  greaterThanEqual: Symbol('greater_than_equal'),// 被校验的数据是否大于等于参数1 一般是数字之间
  lessThan: Symbol('less_than'),// 被校验的数据是否小于参数1 一般是数字之间
  lessThanEqual: Symbol('less_than_equal'),// 被校验的数据是否小于等于参数1 一般是数字之间
  equal: Symbol('equal'),// 被校验的数据是否严格等于参数1
  notEqual: Symbol('not_equal'),// 被校验的数据是否严格不等于参数1
  between: Symbol('between'),// 被校验的数据是否大于等于参数1且小于等于参数2
  strictBetween: Symbol('strict_between'),// 被校验的数据是否大于参数1且小于参数2
  include: Symbol('include'),// 被校验的数据是否存在于参数1这个数组中
  exclude: Symbol('exclude'),// 被校验的数据是否不存在于参数1这个数组中
  regexTest: Symbol('regex_test'),// 使用参数1的正则表达式对数据进行校验
  isValidURL: Symbol('is_valid_url')// 被校验的数据是否是合法URL字符串
};
/**
 * 内置的校验函数
 */
const builtInRules = {
  [validationRules.isAlphabetic]: {
    needParam: false,
    check: uncheckedData => {
      return /^[a-zA-Z]+$/.test(uncheckedData);
    }
  },
  [validationRules.isCapitalizedAlphabetic]: {
    needParam: false,
    check: uncheckedData => {
      return /^[A-Z]+$/.test(uncheckedData);
    }
  },
  [validationRules.isUncapitalizedAlphabetic]: {
    needParam: false,
    check: uncheckedData => {
      return /^[a-z]+$/.test(uncheckedData);
    }
  },
  [validationRules.onlyInteger]: {
    needParam: false,
    check: uncheckedData => {
      return /^-?\d+$/.test(uncheckedData);
    }
  },
  [validationRules.onlyReal]: {
    needParam: false,
    check: uncheckedData => {
      return /^-?\d+\.\d+$/.test(uncheckedData);
    }
  },
  [validationRules.isNumeric]: {
    needParam: false,
    check: uncheckedData => {
      return /^-?\d+(\.?\d+)?$/.test(uncheckedData);
    }
  },
  [validationRules.greaterThan]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData > param1;
    }
  },
  [validationRules.greaterThanEqual]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData >= param1;
    }
  },
  [validationRules.lessThan]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData < param1;
    }
  },
  [validationRules.lessThanEqual]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData <= param1;
    }
  },
  [validationRules.equal]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData === param1;
    }
  },
  [validationRules.notEqual]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return uncheckedData !== param1;
    }
  },
  [validationRules.between]: {
    needParam: true,
    check: (uncheckedData, param1, param2) => {
      return uncheckedData >= param1 && uncheckedData <= param2;
    }
  },
  [validationRules.strictBetween]: {
    needParam: true,
    check: (uncheckedData, param1, param2) => {
      return uncheckedData > param1 && uncheckedData < param2;
    }
  },
  [validationRules.include]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return param1.include(uncheckedData);
    }
  },
  [validationRules.exclude]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      return !param1.include(uncheckedData);
    }
  },
  [validationRules.regexTest]: {
    needParam: true,
    check: (uncheckedData, param1) => {
      if (typeof param1.test === 'function' && param1 instanceof RegExp) {
        return param1.test(uncheckedData);
      }
      return false;
    }
  },
  [validationRules.isValidURL]: {
    needParam: false,
    check: uncheckedData => {
      return /^https?:\/\/([a-zA-Z]+\d*\.)*[a-zA-Z0-9]+\w*(\.[a-z]+)+\??([a-zA-Z_]+=\w+)?(&[a-zA-Z_]+=\w+)*$/.test(uncheckedData);
    }
  }
}
/**
 * 检查目标对象是否有指定的值
 * @param {Object} object 任意对象
 * @param {any} value 任意值
 */
const hasProperty = (object, value) => {
  return Object.prototype.hasOwnProperty.call(object, value);
}
/**
 * 表单数据校验器
 */
class Validator {
  /**
   * 用户自定义的校验规则
   */
  static CustomRules = {};
  /**
   * 初始化校验器
   * @param {[[any, [Symbol, ...any], [number, string]]]} validations 表单校验规则集
   */
  constructor(validations) {
    this.validations = validations;
  }
  /**
   * 注册一个自定义的校验规则
   * @param {Symbol} ruleSymbol 校验规则的符号
   * @param {boolean} needParam 校验规则是否需要参数
   * @param {Function} ruleFunction 存储校验算法的函数
   */
  static AddRule(ruleSymbol, needParam, ruleFunction) {
    if (Validator.CustomRules[ruleSymbol] || validationRules[ruleSymbol]) {
      throw '该自定义规则已经被注册过了';
    }
    Validator.CustomRules[ruleSymbol] = {needParam, check: ruleFunction};
  }
  /**
   * 删除一个指定Symbol的自定义校验规则
   * @param {Symbol} ruleSymbol 被删除的自定义规则的Symbol
   */
  static RemoveRule(ruleSymbol) {
    if (validationRules[ruleSymbol]) {
      throw "无法删除内置校验规则";
    }
    if (Validator.CustomRules[ruleSymbol]) {
      delete Validator.CustomRules[ruleSymbol];
    }
  }
  /**
   * 清空自定义校验规则集
   */
  static ClearRules() {
    Validator.CustomRules = {};
  }
  /**
   * 对校验数据集进行校验
   * @returns {{code: number, msg: string}} err 第一个未通过表单校验的错误信息 全通过返回null
   */
  Validate() {
    if (!this.validations || !Array.isArray(this.validations)) {
      throw "校验规则集必须是数组";
    }
    for (let i = 0; i < this.validations.length; i++) {
      const validationRule = this.validations[i];
      if (!Array.isArray(validationRule) || validationRule.length !== 3) {
        throw "校验规则必须是数组且包含3个元素";
      } else if (!Array.isArray(validationRule[1])) {
        throw "校验规则中的校验函数必须是数组";
      } else if (!Array.isArray(validationRule[2]) || validationRule[2].length !== 2) {
        throw "校验错误信息必须是数组，且包含2个元素";
      }
      const uncheckedData = validationRule[0];
      const checkFuncSymbol = validationRule[1][0];
      let ruleChecker;
      if (hasProperty(builtInRules, checkFuncSymbol)) {
        ruleChecker = builtInRules[checkFuncSymbol];
      } else if (hasProperty(Validator.CustomRules, checkFuncSymbol)) {
        ruleChecker = Validator.CustomRules[checkFuncSymbol];
      } else {
        throw `未找到校验函数${checkFuncSymbol.toString()}`;
      }
      const needParam = ruleChecker.needParam;
      const checkFunc = ruleChecker.check;
      const errInfo = validationRule[2];
      let checkResult = false;
      if (needParam) {
        checkResult = checkFunc(uncheckedData, ...validationRule[1].slice(1));
      } else {
        checkResult = checkFunc(uncheckedData);
      }
      if (!checkResult) {
        return {code: errInfo[0], msg: errInfo[1]};
      }
    }
    return null;
  }
}

module.exports = {
  Validator,
  validationRules
}