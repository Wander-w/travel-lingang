// pages/strategy-detail/strategy-detail.js
import { formateDate } from "../../utils/index.js";
import { useStrategyStar, userAction } from "../../hooks/useLoginFn";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    detail: null,
    swiperActiveIndex: 0,
    isStarLoading: false,
    comment: {
      page: 1,
      size: 10,
      list: [],
      map: {},
      empty: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _id = options._id;

    if (!_id) {
      wx.navigateBack({
        delta: 1,
      });
      wx.showToast({
        title: "缺少_id",
        icon: "error",
      });
      return;
    }
    this.setData({
      _id,
    });
    this.fetchDetail();
    this.fetchComment();
  },

  // 预览图片
  handlePreview() {
    const images = this.data.detail.images.map((item) => item.imagePath);
    const index = this.data.swiperActiveIndex;
    wx.previewImage({
      urls: images,
      current: images[index],
    });
  },

  // 切换轮播图索引
  handleSwiperChange(e) {
    this.setData({
      swiperActiveIndex: e.detail.current,
    });
  },

  // 评论
  handleSubmitComment(e) {
    userAction.call(this, async () => {
      wx.showLoading({
        title: "评论中",
      });

      // 初始化参数
      const params = {
        name: "comment",
        data: {
          requestType: "addComment",
          type: "strategy",
          typeId: this.data._id,
          commentContent: e.detail,
        },
      };
      if (this.data.$state.user.userInfo)
        params.data.userId = this.data.$state.user.userInfo.userId;

      wx.cloud
        .callFunction(params)
        .then(() => {
          wx.showToast({
            title: "评论成功！待审核",
            icon: "none",
          });

          this.fetchDetail();
          this.fetchComment();
        })
        .catch((error) => {
          console.error(error);
          wx.showToast({
            title: "评论失败！",
            icon: "error",
          });
        })
        .finally(() => {
          wx.hideLoading();
        });
    });
  },

  // 收藏
  handleClickStar() {
    useStrategyStar.call(this, this.data.detail._id, "strategy", () => {
      this.fetchDetail();
      this.fetchComment();

      app.data.bus.emit("fetchStrategyList");
    });
  },

  // 获取详情信息
  async fetchDetail() {
    const _id = this.data._id;

    const params = {
      name: "strategy",
      data: {
        requestType: "getDetail",
        _id,
      },
    };
    if (this.data.$state.user.userInfo)
      params.data.userId = this.data.$state.user.userInfo.userId;

    const { result } = await wx.cloud.callFunction(params);

    result.created_time = formateDate(result.created_time);
    this.setData({
      detail: result,
    });
  },

  // 获取评论
  async fetchComment() {
    try {
      this.setData({
        loading: true,
      });

      // 格式化参数
      const params = {
        name: "comment",
        data: {
          requestType: "getCommentList",
          typeId: this.data._id,
          status: "AUDIT", // 获取已审核的评论
          page: this.data.comment.page,
          size: this.data.comment.size,
        },
      };

      this.setData({
        loading: true,
      });

      const { result } = await wx.cloud.callFunction(params);

      // 格式化时间
      result.data.forEach((item) => {
        item.created_time = formateDate(item.created_time);
      });

      this.setData({
        "comment.map": {
          ...this.data.comment.map,
          [this.data.comment.page]: true,
        },
        "comment.list":
          this.data.page === 1
            ? result.data
            : this.data.comment.map[this.data.comment.page]
            ? this.data.comment.list
            : this.data.comment.list.concat(result.data),
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
        loading: true,
      });
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
