// pages/list/list.js
import { cateNavList, scenicSpotNavList } from "../../dict/index";

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cloudName: "",
    placeholder: "",
    type: "",
    page: 1,
    size: 10,
    keyword: "",
    autocompleteList: [],
    dataSourceList: [],
    dataSourceMap: {},
    empty: false,
    loading: false,
    selectOptions: [],
  },

  // 获取景点列表
  async fetchDataSouceList() {
    this.setData({
      loading: true,
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: this.data.cloudName,
        data: {
          requestType: "getDataSourceList",
          page: this.data.page,
          size: this.data.size,
          type: this.data.type,
          keyword: this.data.keyword,
        },
      });

      this.setData({
        dataSourceMap: {
          ...this.data.dataSourceMap,
          [this.data.page]: true,
        },
        dataSourceList:
          this.data.page === 1
            ? result.data
            : this.data.dataSourceMap[this.data.page]
            ? this.data.dataSourceList
            : this.data.dataSourceList.concat(result.data),
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

  // 点击提示框
  handleClickAutocomplete(e) {
    this.setData({
      keyword: e.detail,
    });
    this.fetchDataSouceList();
  },

  // 搜索
  handleSearch(keyword) {
    if (!this.data.keyword) return;
    this.fetchDataSouceList();
  },

  // 点击列表项
  handleClick(e) {
    const _id = e.target.dataset.id;
    const cloudName = this.data.cloudName;
    wx.navigateTo({
      url: `/pages/detail/detail?_id=${_id}&cloudName=${cloudName}`,
    });
  },

  // 选择类型
  handleSelect(e) {
    const value = e.detail;
    this.setData({
      type: value,
    });
    this.fetchDataSouceList();
  },

  // 点击页面非select内容
  handleClickContent(e) {
    if (!e.target.dataset.type || e.target.dataset.type !== "select") {
      app.data.bus.emit("blur");
    }
  },

  setSelectOption() {
    let arr = [];
    switch (this.data.cloudName) {
      case "scenic-spot":
        arr = scenicSpotNavList.map((item) => item.label);
        break;
      case "cate":
        arr = cateNavList.map((item) => item.label);
        break;
      default:
        break;
    }
    this.setData({
      selectOptions: arr,
    });
  },

  async removeDataSource(_id) {
    try {
      wx.showLoading();

      await wx.cloud.callFunction({
        name: this.data.cloudName,
        data: {
          requestType: "removeDataSource",
          _id,
        },
      });

      wx.showToast({
        title: "删除成功！",
        icon: "none",
      });
    } catch (error) {
      wx.showToast({
        title: error,
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },

  handleUpdate(e) {
    const id = e.target.dataset.id;
    const _self = this;
    wx.showModal({
      title: "确定要去修改吗",
      async success(e) {
        if (e.confirm) {
          let activeIndex = null;

          switch (_self.data.cloudName) {
            case "scenic-spot":
              activeIndex = 0;
              break;
            case "cate":
              activeIndex = 1;
              break;
            default:
              throw Error("暂不支持");
          }
          wx.navigateTo({
            url: `/pages/dashboard/dashboard?id=${id}&activeIndex=${activeIndex}`,
          });
        }
      },
    });
  },
  handleRemove(e) {
    const id = e.target.dataset.id;
    const _self = this;

    wx.showModal({
      title: "确定要删除吗",
      async success(e) {
        if (e.confirm) {
          await _self.removeDataSource(id);
          _self.fetchDataSouceList();
          _self.data.autocompleteList.length > 0 && _self.fetchAutocomplete();
          let event = "";
          if (_self.data.cloudName === "cate") event = "randomCateBannerList";
          if (_self.data.cloudName === "scenic-spot")
            event = "randomScenicSpotBannerList";
          event && app.data.bus.emit(event);
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cloudName) {
      let placeholder = "";

      switch (options.cloudName) {
        case "scenic-spot":
          placeholder = "输入景点名称";
          break;
        case "cate":
          placeholder = "输入美食名称";
          break;
        default:
          placeholder = "输入..";
          break;
      }

      wx.setNavigationBarTitle({
        title: options.cloudName === "cate" ? "美食" : "景点",
      });
      this.setData({
        cloudName: options.cloudName,
        placeholder,
      });
    } else {
      wx.navigateBack({
        delta: 1,
      });
      throw Error("页面加载参数错误");
    }

    if (options.type)
      this.setData({
        type: options.type,
      });

    this.setSelectOption();

    this.fetchDataSouceList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchDataSouceList();
  },

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
    this.setData({
      page: 1,
    });

    this.fetchDataSouceList().then().cache().finally(wx.stopPullDownRefresh);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const page =
      !this.data.empty && this.data.dataSourceList.length === this.data.size
        ? this.data.page + 1
        : this.data.page;

    this.setData({
      page,
      empty: false,
    });

    this.fetchDataSouceList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
