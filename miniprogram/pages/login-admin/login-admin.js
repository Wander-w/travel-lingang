// pages/login-admin/login-admin.js
const db = wx.cloud.database();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: "admin",
    password: "admin123.",
    userInfo: null,
    errorMsg: "",
  },
  // 输入修改用户账号与密码
  handleInput(e) {
    const value = e.detail.value;
    const type = e.target.dataset.input;

    switch (type) {
      case "account":
      case "password":
        this.setData({
          [type]: value,
        });
        break;
      default:
        break;
    }
  },

  // 本地校验
  localCheck() {
    let errorMessage = "";

    const account = this.data.account;
    const password = this.data.password;

    // 为空校验 4到16位（字母，数字，下划线，减号）
    if (account === "") errorMessage = "账号不允许为空";
    if (password === "") errorMessage = "密码不允许为空";

    const accountRule = /^[a-zA-Z0-9_-]{4,16}$/;
    const passwordRule = /^(\w|\.){6,20}$/;
    if (!accountRule.test(account))
      errorMessage = "账号不合法：4到16位（字母，数字，下划线，减号)";
    if (!passwordRule.test(password))
      errorMessage = "密码不合法：6-20个字母、数字、下划线、点";

    return errorMessage;
  },

  // Login
  async handleLogin() {
    let errorMessage = this.localCheck();
    try {
      if (errorMessage) throw Error(errorMessage);

      this.login(async () => {
        const tokenResult = await wx.cloud.callFunction({
          name: "user",
          data: {
            requestType: "adminLogin",
            account: this.data.account,
            password: this.data.password,
          },
        });

        if (tokenResult.result.token) {
          wx.setStorageSync("token", `Bearer ${tokenResult.result.token}`);
          wx.setStorageSync("token_type", `admin`);
        }

        this.getUserInfo();

        // 返回除Login相关页面的最近的页面
        const pages = getCurrentPages();
        let backCount = 0;
        for (let i = 0; i < pages.length - 1; i++) {
          if (
            pages.length > 0 &&
            pages[pages.length - 1].route.includes("login")
          )
            backCount++;
        }

        wx.navigateBack({
          delta: backCount,
        });
      });
    } catch (error) {
      errorMessage = error.message ? error.message : error;
    } finally {
      this.setData({
        errorMsg: errorMessage,
      });
    }
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
