const { CollectionName } = require("./Dict");

/**
 * TODO 添加
 * @property { string } name 美食名称
 * @property { string } address 美食地址
 * @property { string } city 美食城市
 * @property { Array<string> } facilities 服务及设施
 * @property { string } open_time 营业时间
 * @property { Array<string> } tag 美食标签
 * @property { Array<{ fileID:string,imagePath:string }> } filePath 新增的云文件路径
 * @property { '火锅'|'其他'|'快餐'|'饮品'|'面包' } type 美食类型
 * @property { Array<{ filePath:string,name:string }> } cate_list  招牌菜
 */
exports.default = async function (db, event) {
  const {
    name,
    address,
    city,
    facilities,
    open_time,
    tag,
    filePath,
    type,
    cate_list,
  } = event;

  const data = {
    name,
    address,
    city,
    facilities: facilities || [],
    open_time,
    tag: tag || [],
    images: filePath || [],
    cate_list: cate_list || [],
    type,
    created_time: new Date(),
    updated_time: new Date(),
  };

  // 添加美食
  return await db.collection(CollectionName).add({ data });
};
