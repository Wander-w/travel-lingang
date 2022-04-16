// components/cate-detail-desc/cate-detail-desc.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      value: () => ({}),
    },
    commentList: {
      type: Array,
      value: () => [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [
      { title: "菜品", index: 0 },
      { title: "评论", index: 1 },
    ],
    activeIndex: 0,
    marginBottom: "35rpx",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // Tab改变
    handleTabChange(e) {
      const index = e.detail;
      this.setData({ activeIndex: index });
    },

    // 美食评论
    async handleSubmitComment(e) {
      try {
        // 初始化参数
        const params = {
          name: "comment",
          data: {
            requestType: "addComment",
            type: "cate",
            typeId: this.data.detail._id,
            userId: this.data.$state.user.userInfo.userId,
            commentContent: e.detail,
          },
        };

        // Loading
        wx.showLoading({
          title: "评论中",
        });

        const result = await wx.cloud.callFunction(params);

        wx.showToast({
          title: "评论成功！待审核",
          icon: "none",
        });

        this.triggerEvent("refresh");
      } catch (error) {
        console.error(error);

        wx.showToast({
          title: "评论失败！",
          icon: "error",
        });
      } finally {
        wx.hideLoading();
      }
    },
  },
});
