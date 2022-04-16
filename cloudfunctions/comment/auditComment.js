const { EnumStatus, CollectionName } = require("./Dict");

/**
 * TODO 审核
 * @property { string } _id 评论id
 * @property { boolean } status 是否审核通过
 */
exports.default = async function (db, event) {
  try {
    const _id = event._id;
    const status = event.status;

    if (!_id) throw Error("缺少评论id");
    if (typeof status !== "boolean") throw Error("缺少必要字段status");

    // 审核通过 true  失败false  通过则可显示     失败则删除评论
    switch (status) {
      case true:
        const { data: comment } = await db
          .collection(CollectionName)
          .doc(_id)
          .get();

        if (comment.status === EnumStatus.AUDIT) return "已经审核通过";
        else if (comment.status === EnumStatus.NOT_AUDIT) {
          // 审核通过 获取用户数据 填充到评论信息中
          const { data: userInfo } = await db
            .collection("userInfo")
            .where({ userId: comment.userId })
            .get();

          // 审核通过 获取文章图片 当做引用
          const { data: article } = await db
            .collection(comment.type)
            .doc(comment.typeId)
            .get();

          const { avatar, username } = userInfo[0];
          const { images } = article;

          await db
            .collection(CollectionName)
            .doc(_id)
            .update({
              data: {
                status: EnumStatus.AUDIT,
                avatar,
                username,
                images: images.map((item) => item.imagePath),
              },
            });

          return "处理成功!【审核通过】";
        } else throw Error("审核出现异常");
      case false:
        await db.collection(CollectionName).doc(_id).remove();
        return "处理成功,【审核不通过】";
    }
  } catch (error) {
    throw Error(error);
  }
};
