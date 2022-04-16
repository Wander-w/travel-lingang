// 可star类型
exports.EnumType = {
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
