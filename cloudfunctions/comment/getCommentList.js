const { EnumStatus, getEmptyResult, CollectionName } = require("./Dict");

/**
 * TODO 获取评论列表
 * @property { number } page default:1 页码
 * @property { number } size default:10 一页数据量
 * @property { string } userId 用户id
 * @property { string } typeId 文章id
 * @property { EnumStatus } status 审核状态
 *
 * TODO 流程:
 * 优先级：status > userId > typeId
 * 1.查询用户自己的评论 userId存在 则访问用户自己评论过的内容    且是审核通过的
 * 2.查询文章的评论     typeId存在 则访问当前文章id下的所有评论内容  且为审核通过的
 * 3.status字段  'ALL' 查询所有 'NOT_AUDIT'  查询审核不通过的    AUDIT查询审核通过的
 */
exports.default = async function (db, event) {
  // 初始值定义
  const page = event.page || 1;
  const size = event.size || 10;
  const userId = event.userId;
  const typeId = event.typeId; // 文章id
  const status = event.status; // 审核状态

  // status 校验
  const validateStatus = [
    EnumStatus.ALL,
    EnumStatus.AUDIT,
    EnumStatus.NOT_AUDIT,
  ].includes(status);

  if (!validateStatus) throw Error("缺少必要字段status");

  // 起始页面
  const start = page === 1 ? 0 : (page - 1) * size;

  let data = {};
  let where = {};
  let total = 0;

  if (status !== "all") where.status = status;

  if (userId) where.userId = userId;
  else if (typeId) where.typeId = typeId;

  // 查询总数
  const countResult = await db.collection(CollectionName).where(where).count();
  total = countResult.total;

  if (!total) return getEmptyResult(page, size);

  // 查询详细信息
  const listResult = await db
    .collection(CollectionName)
    .orderBy("created_time", "desc")
    .where(where)
    .skip(start)
    .limit(size)
    .get();

  const total_page = Math.ceil(total / size);
  const empty = total_page <= page; // 没有下一页数据
  data = listResult.data;

  return {
    empty,
    data,
    page,
    size,
    total,
    total_page,
  };
};
