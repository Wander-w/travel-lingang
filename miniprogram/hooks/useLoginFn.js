export function userAction(fn) {
  const isLogin = this.data.$state.user.isLogin;
  // 登录
  if (isLogin) return fn();

  // 未登录
  wx.showActionSheet({
    alertText: "登录即可进行该操作!",
    itemList: ["去登录"],
  }).then((res) => {
    if (res.tapIndex === 0)
      wx.navigateTo({
        url: "/pages/login/login",
      });
  });
}

/**
 * 需要调用位置的this, 并且this作用域下isStarLoading 为 是否正在收藏中
 * @param {*} id  改变star的攻略id
 */
export function useStrategyStar(_id, type, successFn) {
  userAction.call(this, async () => {
    // 阻止频繁点击
    if (this.data.isStarLoading) return;

    this.setData({
      isStarLoading: true,
    });
    wx.showLoading({ title: "切换中" });

    const userId = this.data.$state.user.userInfo.userId; // 用户id

    try {
      await wx.cloud.callFunction({
        name: "star",
        data: {
          requestType: "changeStar",
          typeId: _id,
          userId,
          type,
        },
      });

      wx.showToast({
        title: "切换成功",
      });

      successFn && successFn();
    } catch (error) {
      console.error(error);
      // wx.showToast({
      //   title: error.message ? error.message : error,
      // });
    } finally {
      wx.hideLoading();

      this.setData({
        isStarLoading: false,
      });
    }
  });
}
