const {Validator} = require('./validator');
const moment = require('moment');

const momentRules = {
  isAfter: Symbol(),
  isValid: Symbol()
};

module.exports = {
  registerMomentRules: () => {
    Validator.AddRule(momentRules.isAfter, true, (momentA, momentB) => {
      if (!(moment.isMoment(momentA) && moment.isMoment(momentB))) {
        return false;
      }
      return momentA.isAfter(momentB);
    });
    Validator.AddRule(momentRules.isValid, false, parsedMoment => {
      return moment.isMoment(parsedMoment) && parsedMoment.isValid();
    });
  },
  removeMomentRules: () => {
    Validator.RemoveRule(momentRules.isAfter);
    Validator.RemoveRule(momentRules.isValid);
  },
  momentRules
};