// miniprogram/pages/my.js
import { userAction } from "../../hooks/useLoginFn";
const routes = [
  {
    label: "我的帖子",
    key: "cate",
    value: "/pages/user-center/user-center",
  },
  {
    label: "我的评论",
    key: "comment",
    value: "/pages/user-center/user-center",
  },
  {
    label: "收藏",
    key: "star",
    value: "/pages/user-center/user-center",
  },
  {
    label: "控制中心",
    key: "dashboard",
    value: "/pages/dashboard/dashboard",
    auth:true
  }
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    routes,
  },

  // 点击用户信息
  handleClickUser(e) {
    const el = e.target;
    const isLogin = this.data.$state.user.isLogin; // 获取当前登录状态
    switch (el.dataset.type) {
      // click avatar AND name
      case "name":
      case "avatar":
        if (isLogin) this.handleOpenUserInfo();
        else
          wx.navigateTo({
            url: "/pages/login/login",
          });
        break;
      default:
        break;
    }
  },

  handleGoToWhere(e) {
    userAction.call(this, () => {
      const type = e.target.dataset.type;
      const page = e.target.dataset.page;

      const path = `${page}?type=${type}`;
      wx.navigateTo({ url: path });
    });
  },

  // 退出登录
  handleLogout() {
    this.logout();
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
  onShow: function () {
  },

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
