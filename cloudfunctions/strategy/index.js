// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

const { default: getDetail } = require("./getDetail");
const { default: addStrategy } = require("./addStrategy");
const { default: autocomplete } = require("./autocomplete");
const { default: getStrategyList } = require("./getStrategyList");
const { default: removeStrategy } = require("./removeStrategy");
const { default: updateStrategy } = require("./updateStrategy");

const modules = {
  getDetail,
  addStrategy,
  autocomplete,
  getStrategyList,
  removeStrategy,
  updateStrategy
};

// 云函数入口函数
exports.main = async (event, context) => {

  if (event && event.requestType) {
    const fnName = event.requestType;
    return modules[fnName](db, event, cloud);
  } else throw Error("requestType Required");
};
