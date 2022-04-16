// 连接的数据库
exports.CollectionName = "scenic_spot";

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
