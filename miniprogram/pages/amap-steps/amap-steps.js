// pages/amap-steps/amap-steps.js
const amapFile = require("../../libs/amap-wx.130.js");
const amapKey = require("../../libs/amap-config.js");
const myAmapFun = new amapFile.AMapWX({
  key: amapKey.key,
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    action: null,
    city: "",
    origin: "",
    destination: "",
    steps: [],
  },

  // 驾车
  getDrivingRoute() {
    const { origin, destination } = this.data;
    const that = this;
    myAmapFun.getDrivingRoute({
      origin,
      destination,
      success: (e) => {
        if (e.paths && e.paths[0] && e.paths[0].steps) {
          const steps = e.paths[0].steps.map((step) => step.instruction);
          this.setData({
            steps,
          });
        }
      },
      fail: function (info) {
        console.error(info);
      },
    });
  },
  // 步行
  getWalkingRoute() {
    const { origin, destination } = this.data;
    const that = this;
    myAmapFun.getWalkingRoute({
      origin,
      destination,
      success: (e) => {
        if (e.paths && e.paths[0] && e.paths[0].steps) {
          const steps = e.paths[0].steps.map((step) => step.instruction);
          this.setData({
            steps,
          });
        }
      },
      fail: function (info) {
        console.error(info);
      },
    });
  },
  // 公交
  getTransitRoute() {
    const { origin, destination, city } = this.data;
    const that = this;
    myAmapFun.getTransitRoute({
      origin,
      destination,
      city,
      success: function (e) {
        const steps = [];
        if (e && e.transits) {
          const transits = e.transits;
          for (var i = 0; i < transits.length; i++) {
            var segments = transits[i].segments;
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (
                segments[j].bus &&
                segments[j].bus.buslines &&
                segments[j].bus.buslines[0] &&
                segments[j].bus.buslines[0].name
              ) {
                var name = segments[j].bus.buslines[0].name;
                if (j !== 0) {
                  name = "--" + name;
                }
                transits[i].transport.push(name);
              }
            }
            steps.push(transits[i].transport);
          }
        }
        that.setData({
          steps,
        });
      },
      fail: function (info) {
        console.error(info);
      },
    });
  },
  // 骑行
  getRidingRoute() {
    const { origin, destination, city } = this.data;
    const that = this;
    myAmapFun.getRidingRoute({
      origin,
      destination,
      city,
      success: (e) => {
        if (e.paths && e.paths[0] && e.paths[0].rides) {
          const steps = e.paths[0].rides.map((step) => step.instruction);
          this.setData({
            steps,
          });
        }
      },
      fail: function (info) {
        console.error(info);
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { action, city, origin, destination } = options;

    this.setData({ action, city, origin, destination });

    switch (action) {
      case "getDrivingRoute":
      case "getWalkingRoute":
      case "getTransitRoute":
      case "getRidingRoute":
        this[action]();
        break;
      default:
        wx.showToast({
          title: "未知错误",
          icon: "error",
        });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
