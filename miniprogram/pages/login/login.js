// miniprogram/pages/login/login.js
const buttons = [
  {
    label: "微信登录",
    value: "wechat",
    openType: "getUserInfo", // 授权获取微信信息
  },
  {
    label: "管理员登录",
    value: "admin",
    openType: "",
  },
];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttons,
  },

  // 点击按钮
  handleClickButton(e) {
    const el = e.target;
    const type = el.dataset.type;

    switch (type) {
      case "admin":
        wx.navigateTo({
          url: "/pages/login-admin/login-admin",
        });
        break;

      default:
        break;
    }
  },

  // 授权登录
  async authLogin(userInfo) {
    try {
      const openIdResult = await wx.cloud.callFunction({
        name: "user",
        data: {
          requestType: "getOpenId",
        },
      });

      const userResult = await wx.cloud.callFunction({
        name: "user",
        data: {
          requestType: "wechatLogin",
          openId: openIdResult.result,
          userInfo,
        },
      });

      if (userResult.result.token) {
        const token = userResult.result.token;
        wx.setStorageSync("token", `Bearer ${token}`);
        wx.setStorageSync("token_type", "wechat");
      }

      this.setUserInfo(userResult.result, () => {
        wx.navigateBack();
      });
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: error.message,
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 获取授权信息
  async authGetUserInfo(e) {
    // 授权失败
    if (!e.detail.userInfo) return;
    // 授权成功
    this.login(this.authLogin.bind(this, e.detail.userInfo));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
