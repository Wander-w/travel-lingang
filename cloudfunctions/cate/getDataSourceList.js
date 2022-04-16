const {
  CollectionName,
  getEmptyResult,
  _generatorCondition,
} = require("./Dict");

/**
 * TODO 获取美食列表
 * @property { number } page default:1 页码
 * @property { number } size default:10 一页数据量
 * @property { string } keyword 关键字
 * @property { '火锅'|'其他'|'快餐'|'饮品'|'面包' } type 美食类型
 */
exports.default = async function (db, event) {
  const page = (event && event.page) || 1;
  const size = (event && event.size) || 10;
  const keyword = event.keyword;
  const type = event.type;
  const _ = db.command;

  // 规则初始化
  const where = [];
  _generatorCondition.call(db, where, "name", keyword);
  _generatorCondition.call(db, where, "type", type);

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
      .where(_.and(where))
      .skip(start)
      .limit(size)
      .get();

    data = listResult.data;
  } else {
    const listResult = await db
      .collection(CollectionName)
      .skip(start)
      .limit(size)
      .get();

    data = listResult.data;
  }

  const total_page = Math.ceil(total / size);
  const empty = total_page <= page; // 没有下一页数据

  return {
    empty,
    data,
    page,
    size,
    total,
    total_page,
  };
};
