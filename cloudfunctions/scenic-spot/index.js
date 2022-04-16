// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

const { default: getDetail } = require("./getDetail");
const { default: autocomplete } = require("./autocomplete");
const { default: addScenicSpot } = require("./addScenicSpot");
const { default: removeDataSource } = require("./removeDataSource");
const { default: updateScenicSpot } = require("./updateScenicSpot");
const { default: randomBannerList } = require("./randomBannerList");
const { default: getDataSourceList } = require("./getDataSourceList");

const modules = {
  getDetail,
  autocomplete,
  addScenicSpot,
  removeDataSource,
  updateScenicSpot,
  randomBannerList,
  getDataSourceList,
};

// 云函数入口函数
exports.main = async (event, context) => {

  if (event && event.requestType) {
    const fnName = event.requestType;
    return modules[fnName](db, event, cloud);
  } else throw Error("requestType Required");
};
