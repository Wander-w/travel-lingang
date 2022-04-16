const { CollectionName } = require("./Dict");

/**
 * TODO 添加攻略
 * @property { string } userId 用户id
 * @property { string } title 标题
 * @property { string } content 帖子内容
 * @property { Array<{ fileID:string,imagePath:string }> } filePath 云文件路径
 */
exports.default = async function (db, event) {
  const { userId, title, content, filePath } = event;

  const { data: users } = await db
    .collection("userInfo")
    .where({ userId })
    .get();

  // 字段模板
  const dataTemplate = {
    title,
    content,
    userId,
    author: users[0].username,
    avatar: users[0].avatar,
    images: filePath || [],
    created_time: new Date(),
  };

  // 添加攻略
  await db.collection(CollectionName).add({ data: dataTemplate });
};
