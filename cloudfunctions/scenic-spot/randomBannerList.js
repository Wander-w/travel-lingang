const { CollectionName } = require("./Dict");

/**
 * TODO 获取随机景点banner 轮播图
 * @property { number } count 默认6张
 */
exports.default = async function (db, event) {
  const count = event.count ? event.count : 6;

  // 随机查询 count 条数据
  const bannerResult = await db
    .collection(CollectionName)
    .aggregate()
    .sample({ size: count })
    .end();

  // 每条中随机 拿 一张
  const result = bannerResult.list
    .filter((item) => item.images.length > 0)
    .map((item) => {
      const length = item.images.length;
      return item.images[Math.floor(Math.random() * length)].imagePath;
    });

  return result;
};
