const utils = require("./utils");
// 微信登录
async function wechatLogin(db, params) {
  const { openId, userInfo } = params;

  const userInfoResult = await db
    .collection("userInfo")
    .where({
      userId: openId,
    })
    .get();

  let user = null;
  let token = null;
  if (userInfoResult.data.length === 0) {
    user = {
      avatar: userInfo.avatarUrl,
      username: userInfo.nickName,
      phone: "",
      userId: openId,
      star_strategy_id: [],
    };

    const addResult = await db.collection("userInfo").add({
      data: user,
    });

    token = utils.randomToken(openId);

    return {
      ...user,
      token,
    };
  } else {
    user = userInfoResult.data[0];
    token = utils.randomToken(openId);

    return {
      ...user,
      token,
    };
  }
}

// 微信获取用户信息
async function wechatGetUserInfo(db, params) {
  return utils.getUserInfo(db, params.token);
}

exports.wechatLogin = wechatLogin;
exports.wechatGetUserInfo = wechatGetUserInfo;
