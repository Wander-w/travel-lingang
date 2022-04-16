const { CollectionName } = require("./Dict");

/**
 * TODO 修改帖子
 * @property { string } _id 帖子id
 * @property { string } title 帖子标题
 * @property { string } content 帖子内容
 * @property { Array<{ fileID:string,imagePath:string }> } filePath 帖子云路径
 */
exports.default = async function (db, event) {
  const { _id, title, content, filePath } = event;

  if (!_id) throw "缺少帖子_id";

  // 追加并替换
  const dataTemplate = {
    title,
    content,
    images: filePath || [],
    updated_time: new Date(),
  };

  // 修改帖子
  return await db
    .collection(CollectionName)
    .doc(_id)
    .update({ data: dataTemplate });
};
