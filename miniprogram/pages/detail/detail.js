// pages/detail/detail.js
import { formateDate } from "../../utils/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cloudName: "",
    _id: null,
    loading: false,
    detail: null,
    comment: {
      page: 1,
      size: 10,
      list: [],
      map: {},
      empty: false,
    },
  },

  // 获取详情
  async fetchDetail() {
    try {
      // 格式化参数
      const params = {
        name: this.data.cloudName,
        data: {
          requestType: "getDetail",
          _id: this.data._id,
        },
      };

      this.setData({
        loading: true,
      });

      const { result } = await wx.cloud.callFunction(params);

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
      this.setData({
        loading: true,
      });
    }
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

  // 去图册
  handleToPicture() {
    wx.navigateTo({
      url: `/pages/picture/picture?_id=${this.data._id}&cloudName=${this.data.cloudName}&requestType=getDetail`,
    });
  },

  // 预览图片
  handlePreview(e) {
    const current = e.target.dataset.current;
    wx.previewImage({
      urls: this.data.detail.images,
      current: current,
    });
  },

  // 打开地图
  handleOpenMap() {
    const { city, address } = this.data.detail;
    const keyword = city === address ? city : city + address;
    wx.navigateTo({ url: "/pages/amap/amap?keyword=" + keyword });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type)
      this.setData({
        type: options.type,
      });

    if (options.cloudName && options._id)
      this.setData({
        cloudName: options.cloudName,
        _id: options._id,
      });
    else {
      wx.navigateBack({
        delta: 1,
      });
      throw Error("页面加载参数错误");
    }

    this.fetchDetail();
    this.fetchComment();
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
