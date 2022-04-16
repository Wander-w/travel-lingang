const { CollectionName, _generatorCondition } = require("./Dict");

/**
 * TODO 获取帖子提示
 * @property { string } keyword 可传可不传
 */
exports.default = async function (db, event) {
  const keyword = event.keyword;
  const limit = 10;
  const _ = db.command;

  // 初始化规则
  const where = [];
  _generatorCondition.call(db, where, "title", keyword);

  if (where.length > 0) {
    const keyResult = await db
      .collection(CollectionName)
      .where(_.or(where))
      .limit(limit)
      .get();

    return keyResult.data.map((item) => item.title);
  } else {
    const keyResult = await db.collection(CollectionName).limit(limit).get();

    return keyResult.data.map((item) => item.title);
  }
};
