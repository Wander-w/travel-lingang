const { CollectionName, _generatorCondition } = require("./Dict");

/**
 * TODO 删除评论
 * @property { string } type 评论类型
 * @property { string } typeId 评论类型Id
 */
exports.default = async function (db, event) {
  const { type, typeId } = event;

  if (!type) throw Error("缺少评论类型");
  if (!typeId) throw Error("缺少评论typeId");

  return db.collection(CollectionName).where({ type, typeId }).remove();
};
