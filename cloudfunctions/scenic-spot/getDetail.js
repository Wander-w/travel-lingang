const { CollectionName } = require("./Dict");

/**
 * @TODO 获取景点详情
 * @property { string } _id 景点id
 */
exports.default = async function (db, event) {
  const { _id } = event;

  if (!_id) throw "缺少景点_id";

  // 获取详情数据
  const { data } = await db.collection(CollectionName).doc(_id).get();

  return data;
};
