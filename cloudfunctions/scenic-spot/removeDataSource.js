const cloud = require("wx-server-sdk");
const { CollectionName } = require("./Dict");

/**
 * TODO 删除景点
 * @property { string } _id 景点id
 */
exports.default = async function (db, event) {
  const { _id } = event;

  if (!_id) throw "缺少景点_id";

  const { data } = await db.collection(CollectionName).doc(_id).get();

  // 删除文件
  if (data.images.length > 0)
    await cloud.deleteFile({
      fileList: data.images.map((item) => item.fileID),
    });

  // 删除信息
  return db.collection(CollectionName).doc(_id).remove();
};
