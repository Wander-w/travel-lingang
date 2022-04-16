const { CollectionName } = require("./Dict");

/**
 * TODO 修改景点
 * @property { string } _id 景点id
 * @property { string } name 景点名称
 * @property { string } address 景点地址
 * @property { string } city 景点城市
 * @property { Array<string> } facilities 设施
 * @property { string } notification 通知
 * @property { string } open_time 开放时间
 * @property { Array<string> } tag 景点标签
 * @property { Array<{ fileID:string,imagePath:string }> } filePath 景点云路径
 * @property { '自然风光'|'人文'|'爱国基地'|'科技馆'|'大学' } type 景点类型
 */
exports.default = async function (db, event) {
  const {
    _id,
    name,
    address,
    city,
    facilities,
    notification,
    open_time,
    tag,
    filePath,
    type,
  } = event;

  if (!_id) throw "缺少景点_id";

  // 追加并替换
  const dataTemplate = {
    name,
    address,
    city,
    facilities: facilities || [],
    notification,
    open_time,
    tag: tag || [],
    images: filePath || [],
    type,
    updated_time: new Date(),
  };

  // 修改景点
  return await db
    .collection(CollectionName)
    .doc(_id)
    .update({ data: dataTemplate });
};
