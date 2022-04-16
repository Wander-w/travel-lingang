// common/reach-bottom-tip/reach-bottom-tip.js
Component({
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
    empty: {
      type: Boolean,
      value: false,
    },
    notData: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    symbol: ".",
    timer: null,
  },
  lifetimes: {
    attached() {
      this.data.timer = setInterval(() => {
        const str = ".".repeat(this.data.symbol.length + 1);
        this.setData({
          symbol: str.length > 3 ? "" : str,
        });
      }, 500);
    },
    detached() {
      clearInterval(this.data.timer);
    },
  },
});
