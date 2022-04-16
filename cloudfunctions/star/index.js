// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

const { default: changeStar } = require("./changeStar");

const modules = {
  changeStar,
};

// 云函数入口函数
exports.main = async (event, context) => {

  if (event && event.requestType) {
    const fnName = event.requestType;
    return modules[fnName](db, event, cloud);
  } else throw Error("requestType Required");
};
