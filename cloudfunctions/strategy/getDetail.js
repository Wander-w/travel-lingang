const { CollectionName } = require("./Dict");

/**
 * @TODO 获取帖子详情
 * @property { string } _id 帖子id
 */
exports.default = async function (db, event) {
  const { _id, userId } = event;

  if (!_id) throw Error("缺少帖子_id");

  // 获取详情数据
  const { data } = await db.collection(CollectionName).doc(_id).get();

  // 删除star列表  显示用户的star状态
  const star_list = data.star_list || [];
  if (userId) data.star = star_list.includes(userId);

  return Object.keys(data).reduce((pre, cur) => {
    if (cur !== "star_list") pre[cur] = data[cur];
    return pre;
  }, {});
};
