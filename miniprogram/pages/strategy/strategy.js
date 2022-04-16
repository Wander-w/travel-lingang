// miniprogram/pages/strategy/strategy.js

import { formateDate } from "../../utils/index";
import { userAction, useStrategyStar } from "../../hooks/useLoginFn";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cloudName: "strategy",
    keyword: "",
    isStarLoading: false,
    autocompleteList: [],
    strategyList: [], // 数据列表
    strategyMap: {},
    empty: false, // 是否已经没数据了
    loading: false, // 加载?
    page: 1,
    size: 10,
  },

  // 获取攻略列表
  async fetchStrategyList() {
    const userId = this.data.$state.user.userInfo
      ? this.data.$state.user.userInfo.userId
      : undefined;
    this.setData({
      loading: true,
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: this.data.cloudName,
        data: {
          requestType: "getStrategyList",
          userId,
          keyword: this.data.keyword,
          page: this.data.page,
          size: this.data.size,
        },
      });

      // 格式化时间
      result.data.forEach((item) => {
        item.created_time = formateDate(item.created_time);
      });

      this.setData({
        strategyMap: {
          ...this.data.strategyMap,
          [this.data.page]: true,
        },
        strategyList:
          this.data.page === 1
            ? result.data
            : this.data.strategyMap[this.data.page]
            ? this.data.strategyList
            : this.data.strategyList.concat(result.data),
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

  // 输入内容
  async handleInput(e) {
    this.setData({
      keyword: e.detail.value,
    });

    clearTimeout(this.timer);

    this.timer = setTimeout(this.fetchAutocomplete, 200);
  },

  // 获取提示数据
  async fetchAutocomplete() {
    const result = await wx.cloud.callFunction({
      name: this.data.cloudName,
      data: {
        requestType: "autocomplete",
        keyword: this.data.keyword,
      },
    });
    this.setData({
      autocompleteList: result.result,
    });
  },
  // 收藏
  async handleClickStar(event) {
    useStrategyStar.call(this, event.detail, "strategy", () => {
      this.fetchStrategyList(this.data.$state.user.userInfo.userId);
    });
  },
  // 删除
  async handleRemove(e) {
    try {
      const _id = e.detail;

      wx.showLoading();

      await wx.cloud.callFunction({
        name: this.data.cloudName,
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

  // 点击添加攻略
  handleClickAdd() {
    userAction.call(this, () => {
      wx.navigateTo({ url: "/pages/strategy-control/strategy-control" });
    });
  },

  // 点击提示框
  handleClickAutocomplete(e) {
    this.setData({
      keyword: e.detail,
    });
    this.fetchStrategyList();
  },

  // 搜索
  handleSearch(keyword) {
    if (!this.data.keyword) return;
    this.fetchStrategyList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 调用监听器，监听数据变化
    app.setWatcher(this);
    this.fetchAutocomplete();
    this.fetchStrategyList();

    app.data.bus.on("fetchStrategyList", () => {
      this.fetchStrategyList();
    });
  },

  watch: {
    "$state.user.isLogin": {
      handler(newValue, oldValue) {
        // 上一次的值与当前不相同 ,则登录状态改变
        if (!oldValue === newValue) {
          wx.nextTick(this.fetchStrategyList);
        }
      },
      deep: true,
    },
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
  onUnload: function () {
    app.data.bus.off();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.setData({
      page: 1,
    });
    await this.fetchStrategyList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const page =
      !this.data.empty && this.data.strategyList.length === this.data.size
        ? this.data.page + 1
        : this.data.page;
    this.setData({
      page,
      empty: false,
    });
    await this.fetchStrategyList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
