// common/custom-select/custom-select.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Array,
      value: () => []
    },
    currentValue: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFoucs: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClickFoucs() {
      this.setData({
        isFoucs: !this.data.isFoucs
      })
    },

    handleClickItem(e) {
      const value = e.target.dataset.value
      this.triggerEvent('select', value)
      this.setData({
        isFoucs: false
      })
    }
  },
  lifetimes: {
    attached() {
      app.data.bus.on('blur', () => {
        this.setData({
          isFoucs: false
        })
      })
    },
    detached() {
      app.data.bus.off()
    }
  }
})