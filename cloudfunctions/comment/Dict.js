// 连接的数据库
exports.CollectionName = "comment";

// 审核状态
exports.EnumStatus = {
  ALL: "ALL",
  NOT_AUDIT: "NOT_AUDIT",
  AUDIT: "AUDIT",
};

// 评论类型
exports.EnumType = {
  cate: "cate", // 美食
  strategy: "strategy", // 攻略帖子
};

// 默认空结果
exports.getEmptyResult = (page, size) => ({
  empty: true,
  data: [],
  page,
  size,
  totoal: 0,
  total_page: 1,
});

// 生成条件
exports._generatorCondition = function (whereOrigin, key, value) {
  if (value) {
    whereOrigin.push({
      [key]: this.RegExp({
        regexp: ".*" + value,
        options: "i", //大小写不区分
      }),
    });
  }
};
