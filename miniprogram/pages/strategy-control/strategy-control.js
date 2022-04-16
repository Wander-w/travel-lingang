// pages/strategy-control/strategy-control.js
import { scriptFormate, uploadFile } from "../../utils/index.js";

const app = getApp();
const bus = app.data.bus;
const uploadCloudPath = `travel-lingang/strategy/images/`;

const fileAddField = (arr, originField) => {
  return arr.map((item) => {
    item.tempFilePath = item[originField];
    return item;
  });
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cloudName: "strategy",
    _id: null,
    filePath: [],
    title: "",
    content: "",
  },

  // 选择文件
  handleSelectFile(e) {
    const { filePath } = this.data;
    filePath.push(...e.detail);
    this.setData({ filePath });
  },
  // 删除文件
  handleRemoveFile(e) {
    const { index } = e.detail;
    const { filePath } = this.data;
    this.setData({
      filePath: filePath.filter((_, itemIndex) => itemIndex !== index),
    });
  },
  // 发布攻略
  async handlePublish() {
    const title = scriptFormate(this.data.title);
    const content = scriptFormate(this.data.content);
    const filePath = this.data.filePath;
    const userId = this.data.$state.user.userInfo.userId;

    const titleLimit = 20;
    const contentLimit = 300;
    // 检查userId是否存在
    if (!userId) {
      wx.navigateBack({
        delta: 1,
      });

      wx.showToast({
        title: "请先登录!",
      });
      return;
    }

    try {
      if (!title) throw "标题不允许为空";
      if (!content) throw "内容不允许为空";
      if (title.length > titleLimit) throw `标题超过${titleLimit}字符`;
      if (content.length > contentLimit) throw `内容超过${contentLimit}字符`;

      const cloudFilePath = await uploadFile(
        uploadCloudPath,
        title.replace(/\s/g, ""),
        filePath
      );

      wx.showLoading({
        title: this.data.id ? "修改中" : "发布中",
      });

      const params = {
        name: "strategy",
        data: {
          requestType: this.data._id ? "updateStrategy" : "addStrategy",
          userId,
          title,
          content,
          _id: this.data._id,
          filePath: cloudFilePath,
        },
      };

      // 上传文件
      await wx.cloud.callFunction(params);

      wx.hideLoading();

      wx.showToast({
        title: this.data.id ? "修改成功!" : "发布成功!",
        icon: "success",
      });

      wx.navigateBack({
        delta: 1,
      });

      bus.emit("fetchStrategyList");
    } catch (error) {
      wx.showToast({
        title: error.message ? error.message : error,
        icon: "error",
      });
    }
  },

  // 输入
  handleInput(e) {
    const value = e.detail.value;
    const type = e.target.dataset.type;

    this.setData({
      [type]: value,
    });
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

      wx.showLoading();

      const { result } = await wx.cloud.callFunction(params);

      const { images, title, content } = result;

      this.setData({
        filePath: fileAddField(JSON.parse(JSON.stringify(images)), "imagePath"),
        title,
        content,
      });
    } catch (error) {
      console.error(error);

      wx.navigateBack({
        delta: 1,
      });

      wx.showToast({
        title: error.message,
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
    if (options._id) {
      this.setData({ _id: options._id });
      this.fetchDetail();
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
