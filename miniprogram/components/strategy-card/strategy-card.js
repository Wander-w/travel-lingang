// common/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 显示模式 default 默认的  thumb缩略
    mode: {
      type: String,
      value: "default",
    },
    hideStar: {
      type: Boolean,
      value: false,
    },

    /**
     * @property { string } key
     * @property { string } name
     * @property { string } title
     * @property { string } avatar
     * @property { boolean } star
     * @property { string } category
     * @property { string } backgroundImage
     */
    cardList: {
      type: Array,
      value: () => [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    dispatcher(e) {
      const type = e.target.dataset.type;
      const _id = e.target.dataset.id;
      let eventName = "";
      switch (type) {
        case "avatar":
          eventName = "clickAvatar";
          break;
        case "name":
          eventName = "clickName";
          break;
        case "star":
          eventName = "clickStar";
          break;
        case "remove":
          eventName = "remove";
          break;
        default:
          break;
      }
      if (type === "bg") {
        wx.navigateTo({
          url: "/pages/strategy-detail/strategy-detail?_id=" + _id,
        });
      } else if (type === "update") {
        wx.navigateTo({
          url: "/pages/strategy-control/strategy-control?_id=" + _id,
        });
      } else this.triggerEvent(eventName, _id);
    },
  },
});
