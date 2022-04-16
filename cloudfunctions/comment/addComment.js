const { EnumType, EnumStatus, CollectionName } = require("./Dict");

/**
 * TODO 添加评论 待审核
 * @property { string } userId 用户id
 * @property { string } typeId 文章id
 * @property { string } commentContent 评论内容
 * @property { 'cate'|'strategy' } type 评论类型 在哪里评论的
 */
exports.default = async function (db, event) {
  const { type, userId, typeId, commentContent } = event;

  // type校验
  const validateType = [EnumType.cate, EnumType.strategy].includes(type);
  if (!validateType) throw Error("缺少评论类型:type");
  if (!commentContent) throw Error("缺少评论内容:commentContent");
  if (!typeId) throw Error("缺少文章ID:typeId");
  if (!userId) throw Error("缺少用户ID:userId");

  // 评论模板
  const template = {
    type,
    typeId,
    userId,
    commentContent,
    status: EnumStatus.NOT_AUDIT,
    created_time: new Date(),
  };

  await db.collection(CollectionName).add({ data: template });

  return "评论待审核!";
};
