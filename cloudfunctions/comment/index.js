// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

const { default: getCommentList } = require("./getCommentList.js");
const { default: addComment } = require("./addComment.js");
const { default: removeComment } = require("./removeComment.js");
const { default: auditComment } = require("./auditComment.js");

const modules = {
  getCommentList,
  addComment,
  removeComment,
  auditComment,
};

// 云函数入口函数
exports.main = async (event, context) => {

  if (event && event.requestType) {
    const fnName = event.requestType;
    return modules[fnName](db, event, cloud);
  } else throw Error("requestType Required");
};