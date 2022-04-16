// components/comment-list/comment-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: () => [],
    },

    mode: {
      type: String,
      value: "default",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e) {
      const keyword = e.detail.value;
      this.setData({
        keyword,
      });
    },
    handleComment() {
      if (this.data.keyword.trim())
        this.triggerEvent("submitComment", this.data.keyword);
      else
        wx.showToast({
          title: "请填入评论内容！",
          icon: "none",
        });
      this.setData({
        keyword: "",
      });
    },
    handlePreviewImage(e) {
      const images = e.target.dataset.images;
      wx.previewImage({
        urls: images,
        current: images[0],
      });
    },

    handleClickThumb(e) {
      const data = e.target.dataset.item;

      switch (data.type) {
        case "strategy":
          wx.navigateTo({
            url: "/pages/strategy-detail/strategy-detail?_id=" + data.typeId,
          });
        case "cate":
          wx.navigateTo({
            url: "/pages/detail/detail?cloudName=cate&_id=" + data.typeId,
          });
          break;
        default:
          throw Error("代码异常请检查跳转类型！");
      }
    },
  },
});
