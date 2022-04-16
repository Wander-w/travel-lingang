const {
  CollectionName,
  getEmptyResult,
  _generatorCondition,
} = require("./Dict");

/**
 * TODO 获取攻略列表
 * @property { number } page default:1 页码
 * @property { number } size default:10 一页数据量
 * @property { string } keyword 关键字
 * @property { string } userId 用户id
 * @property { boolean } star 前提有userId 只用用户喜欢的
 * @property { boolean } user 前提有userId 只要用户的
 */
exports.default = async function (db, event) {
  const page = (event && event.page) || 1;
  const size = (event && event.size) || 10;
  const keyword = event.keyword;
  const userId = event.userId;
  const star = event.star;
  const user = event.user;
  const _ = db.command;

  const where = [];
  _generatorCondition.call(db, where, "title", keyword);

  // star 存在寻找 用户喜欢的
  if (star) {
    if (!userId) throw Error("缺少userId");
    _generatorCondition.call(db, where, "star_list", userId);
  }
  // 只要用户的
  else if (userId && user) {
    _generatorCondition.call(db, where, "userId", userId);
  }

  const start = page === 1 ? 0 : (page - 1) * size;
  let data = [];

  // 获取数据数量
  let countResult = 0;
  if (where.length > 0) {
    countResult = await db
      .collection(CollectionName)
      .where(_.and(where))
      .count();
  } else {
    countResult = await db.collection(CollectionName).count();
  }

  const total = countResult.total;

  // 无数据
  if (!total) return getEmptyResult(page, size);

  if (where.length > 0) {
    const listResult = await db
      .collection(CollectionName)
      .orderBy("created_time", "desc")
      .where(_.and(where))
      .skip(start)
      .limit(size)
      .get();

    data = listResult.data;
  } else {
    const listResult = await db
      .collection(CollectionName)
      .orderBy("created_time", "desc")
      .skip(start)
      .limit(size)
      .get();

    data = listResult.data;
  }

  const total_page = Math.ceil(total / size);
  const empty = total_page <= page; // 没有下一页数据

  // 删除star列表  显示用户的star状态
  data = data.map((item) => {
    const star_list = item.star_list || [];
    if (userId) item.star = star_list.includes(userId);
    return Object.keys(item).reduce((pre, cur) => {
      if (cur !== "star_list") pre[cur] = item[cur];
      return pre;
    }, {});
  });

  return {
    empty,
    data,
    page,
    size,
    total,
    total_page,
  };
};
