const { EnumType } = require("./Dict");

/**
 * TODO 添加Star
 * @property { string } userId 用户id
 * @property { string } typeId 被star的文章或xx
 * @property { 'strategy' } type 在哪里点的star
 */
exports.default = async function (db, event) {
  const { type, userId, typeId } = event;

  // type校验
  const validateType = [EnumType.strategy].includes(type);

  if (!validateType) throw Error("缺少Star类型:type");
  if (!typeId) throw Error("缺少被Star的文章等ID:typeId");
  if (!userId) throw Error("缺少用户ID:userId");

  const { data } = await db.collection(type).doc(typeId).get();

  const star_list = data.star_list || [];

  const index = star_list.indexOf(userId);

  if (index === -1) star_list.push(userId);
  else star_list.splice(index, 1);

  await db.collection(type).doc(typeId).update({
    data: {
      star_list,
    },
  });

  return "Star切换成功";
};
