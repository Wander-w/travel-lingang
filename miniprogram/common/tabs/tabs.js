// common/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * title 显示的title
     * index 索引key
     * key 英文key
     */
    tabs: {
      type: Array,
      value: () => [],
    },

    activeIndex: {
      type: Number,
    },

    activeColor: {
      type: String,
      value: "#08c1a8",
    },

    marginBottom: {
      type: String,
      value: "10rpx",
    },

    mini: {
      type: Boolean,
      value: false,
    },

    border: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
  },
  
  observers: {
    activeIndex(v) {
      if (v === this.data.currentIndex) return;
      this.setData({
        currentIndex: v,
      });
    },
    currentIndex(v) {
      this.triggerEvent("change", v);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClickTabItem(e) {
      const index = e.target.dataset.index;
      // 避免重复点击赋值
      if (this.data.currentIndex === index) return;
      this.setData({
        currentIndex: index,
      });
    },
  },
});
