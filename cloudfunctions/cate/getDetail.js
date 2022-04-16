const { CollectionName } = require("./Dict");
/**
 * TODO 获取美食详情
 * @property { string } _id 美食id
 */
exports.default = async function (db, event) {
  const { _id } = event

  if (!_id) throw Error("缺少美食_id");

  // 获取详情数据
  const { data } = await db.collection(CollectionName).doc(_id).get();

  return data;
};
