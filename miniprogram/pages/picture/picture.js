// pages/picture/picture.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id: "",
    cloudName: "", // 执行的云函数
    requestType: "",
    loading: false,
    pictureList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _id = options._id;
    const cloudName = options.cloudName;
    const requestType = options.requestType;
    if (_id && cloudName && requestType) {
      this.setData({
        _id,
        cloudName,
        requestType,
      });
      this.fetchPictureList();
    } else {
      wx.showToast({
        title: "该资源不存在",
      });
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  // 获取图片列表
  async fetchPictureList() {
    this.setData({
      loading: true,
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: this.data.cloudName,
        data: {
          requestType: this.data.requestType,
          _id: this.data._id,
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
        this.setData({
          pictureList: result.images,
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

  // 预览图片
  handlePreview(e) {
    const current = e.target.dataset.current;

    wx.previewImage({
      urls: this.data.pictureList.map(item=>item.imagePath),
      current: current,
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
