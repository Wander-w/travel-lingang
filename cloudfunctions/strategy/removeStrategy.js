const {
  CollectionName
} = require("./Dict");
const cloud = require("wx-server-sdk");

/**
 * @TODO 删除帖子
 * @property { string } _id 帖子id
 */
exports.default = async function (db, event) {
  const {
    _id
  } = event;

  if (!_id) throw Error("缺少帖子_id");

  const {
    data
  } = await db.collection(CollectionName).doc(_id).get();

  // 删除文件
  if (data.images.length > 0)
    await cloud.deleteFile({
      fileList: data.images.map((item) => item.fileID),
    });

  // 删除信息
  return Promise.all(
    [cloud.callFunction({
        name: "comment",
        data: {
          requestType: "removeComment",
          type: "strategy",
          typeId: _id,
        },
      }),
      db.collection(CollectionName).doc(_id).remove()
    ]
  );
};