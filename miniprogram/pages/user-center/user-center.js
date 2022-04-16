// pages/user-center/user-center.js
import utils from "../../utils/index";
import { useStrategyStar } from "../../hooks/useLoginFn";
const app = getApp();
const routes = [
  {
    title: "帖子",
    key: "cate",
    index: 0,
  },
  {
    title: "评论",
    key: "comment",
    index: 1,
  },
  {
    title: "收藏",
    key: "star",
    index: 2,
  },
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: routes,
    activeIndex: 0,
    isStarLoading: false,
    empty: false, // 是否已经没数据了
    list: [], // 数据列表
    map: {},
    loading: false, // 加载?
    page: 1,
    size: 10,
  },
  // 跟新索引与数据
  changeIndexAndFetchDataSource(index) {
    this.setData({
      activeIndex: index,
      list: [],
      page: 1,
      map: {},
    });
    if (index === 0 || index === 2) this.fetchStrategyList();
    else if (index === 1) this.fetchCommentList();
  },
  // tab切换
  handleTabChange(e) {
    const index = e.detail;
    this.changeIndexAndFetchDataSource(index);
  },
  // 获取自己的评论列表
  async fetchCommentList() {
    const userId = this.data.$state.user.userInfo.userId;

    this.setData({
      loading: true,
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: "comment",
        data: {
          requestType: "getCommentList",
          userId,
          status: "AUDIT",
          page: this.data.page,
          size: this.data.size,
        },
      });

      result.data = result.data.map((item) => {
        item.created_time = utils.formateDate(item.created_time);
        return item;
      });
      this.setData({
        map: {
          ...this.data.map,
          [this.data.page]: true,
        },
        list:
          this.data.page === 1
            ? result.data
            : this.data.map[this.data.page]
            ? this.data.list
            : this.data.list.concat(result.data),
        empty: result.empty,
      });
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: error.message,
        icon: "error",
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },
  // 获取帖子列表
  async fetchStrategyList() {
    const userId = this.data.$state.user.userInfo.userId;
    const { activeIndex } = this.data;
    this.setData({
      loading: true,
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: "strategy",
        data: {
          requestType: "getStrategyList",
          userId,
          page: this.data.page,
          size: this.data.size,
          star: activeIndex === 2,
          user: activeIndex === 0,
        },
      });
      this.setData({
        map: {
          ...this.data.map,
          [this.data.page]: true,
        },
        list:
          this.data.page === 1
            ? result.data
            : this.data.map[this.data.page]
            ? this.data.list
            : this.data.list.concat(result.data),
        empty: result.empty,
      });
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: error.message,
        icon: "error",
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },
  // 收藏
  async handleClickStar(event) {
    useStrategyStar.call(this, event.detail, "strategy", () => {
      this.fetchStrategyList();
      app.data.bus.emit("fetchStrategyList");
    });
  },
  // 删除
  async handleRemoveStrategy(e) {
    try {
      const _id = e.detail;

      wx.showLoading();

      await wx.cloud.callFunction({
        name: "strategy",
        data: {
          requestType: "removeStrategy",
          _id,
        },
      });

      wx.showToast({
        title: "删除成功！",
        icon: "none",
      });

      this.fetchStrategyList();
    } catch (error) {
      wx.showToast({
        title: error,
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type ?? "cate";
    const current = routes.filter((item) => item.key === type)[0];
    this.changeIndexAndFetchDataSource(current.index);
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
