const { CollectionName } = require("./Dict");

/**
 * TODO 添加景点
 * @property { string } name 景点名称
 * @property { string } address 景点地址
 * @property { string } city 景点城市
 * @property { Array<string> } facilities 服务及设施
 * @property { string } notification 通知
 * @property { string } open_time 开放时间
 * @property { Array<string> } tag 景点标签
 * @property { string } filePath 景点云路径
 * @property { '自然风光'|'人文'|'爱国基地'|'科技馆'|'大学' } type 景点类型
 */

exports.default = async function (db, event) {
  const {
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

  const data = {
    name,
    address,
    city,
    facilities: facilities || [],
    notification,
    open_time,
    tag: tag || [],
    images: filePath || [],
    type,
    created_time: new Date(),
    updated_time: new Date(),
  };

  // 添加景点
  return await db.collection(CollectionName).add({ data });
};
