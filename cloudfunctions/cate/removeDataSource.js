const cloud = require("wx-server-sdk");
const {
  CollectionName
} = require("./Dict");

/**
 * TODO 删除美食
 * @property { string } _id 美食id
 */
exports.default = async function (db, event) {
  const {
    _id
  } = event;

  if (!_id) throw "缺少美食_id";

  const {
    data
  } = await db.collection(CollectionName).doc(_id).get();

  // 删除文件
  if (data.images.length > 0)
    await cloud.deleteFile({
      fileList: data.images.map((item) => item.fileID),
    });

  // 删除招牌菜图片
  if (data.cate_list.length > 0) {
    const fileList = [];
    data.cate_list.forEach((item) => {
      item.files.map((item) => {
        fileList.push(item.fileID);
      });
    });

    fileList.length > 0 &&
      (await cloud.deleteFile({
        fileList,
      }));
  }

  // 删除信息
  return Promise.all(
    [cloud.callFunction({
        name: "comment",
        data: {
          requestType: "removeComment",
          type: "cate",
          typeId: _id,
        },
      }),
      db.collection(CollectionName).doc(_id).remove()
    ]
  );
};