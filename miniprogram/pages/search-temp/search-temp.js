// pages/search-temp/search-temp.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cloudName: "",
    placeholder: "",
    page: 1,
    size: 10,
    keyword: "",
    autocompleteList: [],
    dataSourceList: [],
    dataSourceListMap: {},
    empty: false,
    loading: false,
  },

  // 获取景点列表
  async fetchDataSourceList() {
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
        dataSourceListMap: {
          ...this.data.dataSourceListMap,
          [this.data.page]: true,
        },
        dataSourceList:
          this.data.page === 1
            ? result.data
            : this.data.dataSourceListMap[this.data.page]
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
        loading: true,
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
    this.fetchDataSourceList();
  },

  // 搜索
  handleSearch(keyword) {
    if (!this.data.keyword) return;
    this.fetchDataSourceList();
  },

  // 点击列表项
  handleClick(e) {
    const _id = e.target.dataset.id;
    const cloudName = this.data.cloudName;
    wx.navigateTo({
      url: `/pages/detail/detail?_id=${_id}&cloudName=${cloudName}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.cloudName) throw Error("请传入请求的云函数名");
    
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
    this.setData({
      cloudName: options.cloudName,
      placeholder,
    });

    this.fetchAutocomplete();
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
  onReachBottom: function () {
    const page =
      !this.data.empty && this.data.dataSourceList.length === this.data.size
        ? this.data.page + 1
        : this.data.page;

    this.setData({
      page,
      empty: false,
    });

    this.fetchDataSourceList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
