// components/dashboard/comment/comment.js
import utils from "../../../utils/index";
import { EnumCommentStatus } from "../../../dict/index";
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    size: 15,
    loading: false,
    total: 0,
    list: [], // 数据列表
    map: {},
  },
  lifetimes: {
    attached() {
      const self = this;
      this.fetchCommentList();
      // 滚动到底部
      app.data.bus.on("commentReachBottom", self.commentReachBottom.bind(self));
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取未审核的评论
    async fetchCommentList() {
      try {
        // 初始化参数
        const params = {
          name: "comment",
          data: {
            requestType: "getCommentList",
            page: this.data.page,
            size: this.data.size,
            status: EnumCommentStatus.NOT_AUDIT,
          },
        };

        // Loading
        wx.showLoading();
        this.setData({
          loading: true,
        });

        const { result } = await wx.cloud.callFunction(params);


        const data = result.data.map((item) => {
          item.created_time = utils.formateDate(item.created_time);
          item.collapsed = true;
          return item;
        });

        this.setData({
          map: {
            ...this.data.map,
            [this.data.page]: true,
          },
          list:
            this.data.page === 1
              ? data
              : this.data.map[this.data.page]
              ? this.data.list
              : this.data.list.concat(data),
          empty: result.empty,
          total: result.total,
        });

      } catch (error) {
        console.error(error);

        wx.showToast({
          title: error.message,
          icon: "error",
        });
      } finally {
        wx.hideLoading();
        this.setData({
          loading: false,
        });
      }
    },

    // 审核
    async handleAudit(e) {
      if (this.data.loading) return;

      try {
        const _id = e.target.dataset.id;
        const status = JSON.parse(e.target.dataset.status);

        if (!_id) throw Error("评论id不存在");

        // 初始化参数
        const params = {
          name: "comment",
          data: {
            requestType: "auditComment",
            _id,
            status,
          },
        };

        // Loading
        wx.showLoading();
        this.setData({
          loading: true,
        });

        const { result } = await wx.cloud.callFunction(params);


        const list = this.data.list;

        this.setData({
          list: list.filter((item) => item._id !== _id),
        });
        this.fetchCommentList();
        wx.showToast({
          title: `处理成功!【${status ? "审核成功" : "审核不通过"}】`,
          icon: "none",
        });
      } catch (error) {
        console.error(error);

        wx.showToast({
          title: error.message,
          icon: "error",
        });
      } finally {
        wx.hideLoading();
        this.setData({
          loading: false,
        });
      }
    },

    // 滚动到底部
    commentReachBottom() {
      const page =
        !this.data.empty && this.data.list.length < this.data.total
          ? this.data.page + 1
          : this.data.page;

      this.setData({ page });

      this.fetchCommentList();
    },

    // 展开收回
    handleCollapsed(e) {
      const list = this.data.list;
      const index = e.target.dataset.index;

      list[index].collapsed = !list[index].collapsed;

      this.setData({ list });
    },
  },
});
