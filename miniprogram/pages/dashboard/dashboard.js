// pages/dashboard/dashboard.js
import { doashboardTabs } from "../../dict/index";
import { formateDate } from "../../utils/index.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: doashboardTabs,
    activeIndex: 0,
    id: null,
    detail: null,
  },
  handleTabChange(e) {
    const activeIndex = e.detail;
    this.setData({ activeIndex, subActiveIndex: 0 });
  },
  handleChangeSubIndex(e) {
    const subActiveIndex = e.target.dataset.index;
    this.setData({ subActiveIndex });
  },
  handleToggleCollapse() {
    this.setData({ collapsed: !this.data.collapsed });
  },

  // 获取景点或美食
  async fetchDetail() {
    const cloudName = ["scenic-spot", "cate"];
    const _self = this;
    try {
      wx.showLoading();

      const { result } = await wx.cloud.callFunction({
        name: cloudName[_self.data.activeIndex],
        data: {
          requestType: "getDetail",
          _id: _self.data.id,
        },
      });

      if (typeof result === "string") {
        wx.showToast({
          title: result,
          icon: "error",
        });

        wx.navigateBack({
          delta: 1,
        });
      } else {

        if (result.commentList) {
          result.commentList = result.commentList.map((item) => {
            item.created_time = formateDate(item.created_time);
            return item;
          });
        }

        this.setData({
          detail: result,
        });
      }
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: error.message,
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },


  handleUpdated() {
    const activeIndex = this.data.activeIndex;
    if (activeIndex === 0 || activeIndex === 1) this.fetchDetail();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      const activeIndex = Number(options.activeIndex);
      this.setData({
        id: options.id,
        activeIndex,
      });
      if (activeIndex === 0 || activeIndex === 1) this.fetchDetail();
    }
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
  onPullDownRefresh: function () {
    // 评论刷新
    if (this.data.activeIndex === 2)
      app.data.bus.emit("commentPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 评论滚动到底部
    if (this.data.activeIndex === 2) app.data.bus.emit("commentReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
