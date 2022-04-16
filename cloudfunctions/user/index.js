// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

const admin = require("./admin");
const wechatLogin = require("./wechatLogin");
// 云函数入口函数
exports.main = async (event, context) => {
  const wx = cloud.getWXContext();

  if (event && event.requestType) {
    const requestType = event.requestType;

    const adminFnCall = (fn) => admin[fn].call(null, db, event);
    const wechatFnCall = (fn) => wechatLogin[fn].call(null, db, event);

    switch (requestType) {
      case "adminLogin":
      case "adminGetAccountInfo":
        return await adminFnCall(requestType);
      case "wechatLogin":
      case "wechatGetUserInfo":
        return await wechatFnCall(requestType);
      case "getOpenId":
        return wx.APPID;
      default:
        return {};
    }
  } else throw Error("requestType Required");
};
