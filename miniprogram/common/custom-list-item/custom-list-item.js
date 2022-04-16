// common/custom-list-item/custom-list-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    type: {
      type: String,
      value: ""
    },
    tag: {
      type: Array,
      value: ""
    },
    image: {
      type: String,
      value: ""
    },
    max: {
      type: Number,
      value: 10
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
})