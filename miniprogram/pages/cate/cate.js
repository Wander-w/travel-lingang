// miniprogram/pages/cate/cate.js
import { cateNavList } from "../../dict/index";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    navList: cateNavList,
  },
  // 获取banner列表
  async fetchBannerList() {
    const bannerResult = await wx.cloud.callFunction({
      name: "cate",
      data: {
        requestType: "randomBannerList",
      },
    });
    this.setData({
      bannerList: bannerResult.result,
    });
  },

  // 去往指定路径页面
  handleGoToCustomPath(e) {
    const path = e.target.dataset.path;
    wx.navigateTo({
      url: path,
    });
  },

  // 预览图片
  handlePreview(e) {
    const url = e.target.dataset.src;
    wx.previewImage({
      urls: this.data.bannerList,
      current: url,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchBannerList();
    app.data.bus.on("randomCateBannerList", () => {
      this.fetchBannerList();
    });
  },

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
