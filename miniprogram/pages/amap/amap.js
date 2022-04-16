// pages/amap/amap.js
const amapFile = require("../../libs/amap-wx.130.js");
const amapKey = require("../../libs/amap-config.js");

const utils = require("../../utils/index.js");
const markerDefaultIconPath = "../../images/map/map-marker.svg";
const markerDefaultIconPathSelected = "../../images/map/map-marker--check.svg";
const myAmapFun = new amapFile.AMapWX({
  key: amapKey.key,
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: "",
    longitude: "",
    textData: {},
    showSteps: false,
    tips: [],
    keyword: "",
    action: { value: "", name: "" }, // 公交 骑行等
    polyline: null,
    includePoints: null,
    navigateInfo: null,
    scale: 14,
    inputFoucs: false,
  },
  // 初始化地图数据  检索周边的POI
  getPoiAround() {
    myAmapFun.getPoiAround({
      iconPath: markerDefaultIconPath,
      iconPathSelected: markerDefaultIconPathSelected,
      success: (data) => {
        this.setData({
          markers: data.markers,
          latitude: data.markers[0].latitude,
          longitude: data.markers[0].longitude,
        });
        this.showMarkerInfo(data.markers, 0);
      },
      fail: function (info) {
        wx.showModal({
          title: info.errMsg,
        });
      },
    });
  },

  // 操作marker显示信息
  makertap: function (e) {
    var id = e.detail.markerId;
    this.showMarkerInfo(this.data.markers, id);
    this.changeMarkerColor(this.data.markers, id);
  },

  // 显示marker信息
  showMarkerInfo: function (data, id) {
    this.setData({
      textData: {
        name: data[id].name,
        desc: data[id].address,
      },
    });
  },
  // 改变marker颜色
  changeMarkerColor: function (data, id) {
    const markers = [];
    for (var j = 0; j < data.length; j++) {
      data[j].iconPath =
        j == id ? markerDefaultIconPathSelected : markerDefaultIconPath;
      markers.push(data[j]);
    }
    this.setData({
      markers: markers,
    });
  },

  // 计算经纬度
  getDistance: function (lat1, lng1, lat2, lng2) {
    lng1 = lng1 || 0;
    lng2 = lng2 || 0;
    var rad1 = (lat1 * Math.PI) / 180.0;
    var rad2 = (lat2 * Math.PI) / 180.0;
    var a = rad1 - rad2;
    var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
    // WGS84椭球的长半轴就为6378137.0
    var r = 6378137;
    var distance =
      r *
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    return distance;
  },

  // 将北纬经纬拆分
  splitLocation(location) {
    const longitude = location.split(",")[0];
    const latitude = location.split(",")[1];
    return {
      longitude,
      latitude,
    };
  },

  getInputTips(keywords) {
    myAmapFun.getInputtips({
      keywords,
      success: (data) => {

        // 拆分经纬北纬
        const tips = data.tips.map((item) => {
          if (item.location && typeof item.location === "string") {
            const { longitude, latitude } = this.splitLocation(item.location);
            item.longitude = longitude;
            item.latitude = latitude;
            // 计算距离
            item.distance = this.getDistance(
              this.data.latitude,
              this.data.longitude,
              latitude,
              longitude
            );

            // 1公里
            const gm = 1000;
            if (item.distance && typeof item.distance === "number") {
              if (item.distance > gm)
                item.distanceDesc = (item.distance / gm).toFixed(2) + "公里";
              else item.distanceDesc = parseInt(item.distance) + "米";
            }
          } else {
            item.noLocation = true;
          }
          return item;
        });

        this.setData({ tips });
      },
      fail(error) {
        console.error(error);
      },
    });
  },
  // 输入
  handleInput: utils.debounce(function (e) {
    const keywords = e.detail.value;
    // 输入时如果有之前的信息则删掉
    if (this.data.navigateInfo) {
      this.setData({
        navigateInfo: null,
      });
    }
    this.getInputTips(keywords);
  }, 300),

  // 点击输入时的提示
  handleClickTips(e) {
    const value = e.target.dataset.item;

    this.setData({
      keyword: value.name,
      navigateInfo: value.noLocation ? null : value,
    });

    if (this.data.navigateInfo) {
      this.setData({
        textData: {
          name: value.name,
          desc: `${value.district}${value.address}`,
        },
      });
    } else {
      wx.showToast({
        title: "该地区暂不支持导航",
        icon: "none",
      });
    }
  },

  // 计算时间
  destinationComputedTime(goType, destination, duration) {
    // duration 为秒
    const m = 60;
    const h = 60 * m;
    const d = 24 * h;
    const timeMap = {
      [m]: "分钟",
      [h]: "小时",
      [d]: "天",
    };
    let time = duration;
    let timeDesc = time + "秒";

    // 计算时间
    if (time > d) {
      time = (time / d).toFixed(2);
      timeDesc = time + timeMap[d];
    } else if (time > h) {
      time = (time / h).toFixed(2);
      timeDesc = time + timeMap[h];
    } else {
      time = (time / m).toFixed(2);
      timeDesc = time + timeMap[m];
    }

    // 语义化 拿到小数点后2位
    const helpStr = time.split(".")[1] > 50 ? "半" : "多";

    return `${goType}前往 ${destination} 大概需要${timeDesc}${helpStr}`;
  },

  /**
   * 去目的地
   * 1. 设置起点与终点
   * 2. 通过steps进行划线,并视口缩放到用户可以看到起点与终点
   * @param {Array} steps 路线
   */
  goToDestination(steps) {
    const markers = this.data.markers;
    const longitude = this.data.longitude;
    const latitude = this.data.latitude;
    const info = this.data.navigateInfo;

    // 加入起点和终点的marker
    markers[0].iconPath = "../../images/map/map-start.svg";

    markers.push({
      id: markers.length,
      address: info.address,
      iconPath: "../../images/map/map-end.svg",
      latitude: info.latitude,
      longitude: info.longitude,
      name: info.name,
      width: 22,
      height: 32,
    });

    // 画线
    const polylineArr = [];
    steps.forEach((item) => {
      // item.polyline : 经纬,北纬;经纬,北纬
      const polylines = item.polyline.split(";").forEach((item) => {
        polylineArr.push(this.splitLocation(item));
      });
      polylineArr.concat(polylines);
    });

    // 标点 & 缩放视野
    this.setData({
      markers,
      includePoints: [
        { latitude, longitude },
        { latitude: info.latitude, longitude: info.longitude },
      ],
      polyline: [
        {
          points: polylineArr,
          color: "#0091ff",
          width: 6,
        },
      ],
    });
  },

  handleFoucs() {
    this.setData({
      inputFoucs: true,
    });
  },

  handleBlur() {},

  // 获取起点终点经纬北纬
  getOriginAndDestination() {
    const info = this.data.navigateInfo;
    const longitude = this.data.longitude;
    const latitude = this.data.latitude;

    const origin = `${longitude},${latitude}`;
    const destination = info.location;
    return {
      origin,
      destination,
    };
  },

  // 去路线页
  handleToStepsDetail() {
    const { origin, destination } = this.getOriginAndDestination();
    const action = this.data.action;
    const city =
      this.data.navigateInfo.district + this.data.navigateInfo.address;
    wx.navigateTo({
      url: `/pages/amap-steps/amap-steps?action=${action.value}&city=${city}&origin=${origin}&destination=${destination}`,
    });
  },
  // 格式化公交
  formateTransits(e) {
    const { distanice, transits } = e;
    const duration = transits.reduce((pre, cur) => {
      return Number(pre) + Number(cur.duration);
    }, 0);

    const steps = [];
    // console.log(distanice);
    // console.log(transits);
    wx.showToast({
      title: "公交暂不支持在线预览路线,请查看详情路线",
      icon: "none",
    });

    return {
      distanice,
      duration,
      steps,
    };
  },

  // 导航
  handleNavigate() {
    const { origin, destination } = this.getOriginAndDestination();
    const info = this.data.navigateInfo;
    const city = info.district + info.address;
    const _self = this;
    let action = null; // 如何进行导航

    const options = {
      origin,
      destination,
      city,
      success: (e) => {
        const originName = this.data.keyword;
        const originDesc = this.data.textData.desc;
        const path = e.paths ? e.paths[0] : this.formateTransits(e); // transits 公交

        let taxi_cost = e.taxi_cost || "";

        this.setData({
          textData: {
            name: _self.destinationComputedTime(
              action.name,
              originName,
              path.duration
            ),
            desc: taxi_cost
              ? `打车大概需要花费${taxi_cost}元`
              : `${originDesc}`,
          },
          inputFoucs: false,
          showSteps: true,
        });

        let value = path.steps;
        if (this.data.action.value === "getRidingRoute") value = path.rides;

        this.goToDestination(value);
      },
    };

    wx.showActionSheet({
      alertText: "出行场景",
      itemList: ["驾车", "步行", "公交", "骑行"],
      success: (e) => {
        switch (e.tapIndex) {
          case 0:
            action = {
              name: "驾车",
              value: "getDrivingRoute",
            };
            myAmapFun.getDrivingRoute(options);
            break;
          case 1:
            action = {
              name: "步行",
              value: "getWalkingRoute",
            };
            myAmapFun.getWalkingRoute(options);
            break;
          case 2:
            action = {
              name: "公交",
              value: "getTransitRoute",
            };
            myAmapFun.getTransitRoute(options);
            break;
          case 3:
            action = {
              name: "骑行",
              value: "getRidingRoute",
            };
            myAmapFun.getRidingRoute(options);
            break;
          default:
            break;
        }

        if (!action) return;

        this.setData({
          action,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPoiAround();

    // 自动填充 帮助快速导航
    if (options.keyword) {
      const keyword = options.keyword;
      this.setData({
        inputFoucs: true,
        keyword,
      });

      this.getInputTips(keyword);
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
